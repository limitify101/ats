import React, { useContext, useEffect, useState } from 'react';
import { supabase } from '@/supabase'; // Ensure supabase is correctly initialized
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import axios from 'axios';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check session and update state
    const checkSession = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (user) {
          setCurrentUser(user); // Set current user from session
          const lastVisitedRoute = localStorage.getItem('lastVisitedRoute');
          if (lastVisitedRoute) {
            navigate(lastVisitedRoute); // Navigate to the last visited route
          } else {
            navigate('/dashboard/home'); // Default to dashboard if no route saved
          }
        } else {
          setCurrentUser(null);
        }

        if (error) {
          // toast(error.message, { type: 'error' });
          setCurrentUser(null);  // Clear user if there's an error
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setCurrentUser(null); // Clear user on error
      } finally {
        setLoading(false);  // Ensure loading is set to false no matter what
      }
    };

    checkSession();

    // Subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setCurrentUser(session.user);
        const lastVisitedRoute = localStorage.getItem('lastVisitedRoute');
        if (lastVisitedRoute) {
          navigate(lastVisitedRoute);
        } else {
          navigate('/dashboard/home');
        }
        setLoading(false); // Set loading to false on sign-in
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        navigate('/auth/login'); // Clear user state on sign-out
      }
    });

    // Clean up listener on unmount
    return () => {
      if (listener) {
        listener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  // Sign up function
  async function signup(username, email, phone, password) {
    try {
      setLoading(true); // Start loading

      // Sign up the user
      const { data: user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            displayName: username,
            phone: phone,
          },
        },
      });

      if (error) {
        toast(error.message, { type: "error" });
        throw error;
      }

      if (!user) {
        throw new Error("User sign-up failed. No user data returned.");
      }

      // Create client
      try {
        const response = await axios.post(
          `https://ats-kkcp.onrender.com/api/v1/client/create`,
          {},
          {
            headers: {
              "x-tenant-id": user.user.id,
            },
          }
        );
        console.log("Client created successfully:", response.data);
      } catch (axiosError) {
        console.error("Failed to create client:", axiosError);
        toast("Failed to create client. Please try again later.", { type: "error" });
      }

      // Notify user of successful account creation
      toast(
        "Account created successfully! Please check your email for verification.",
        { type: "success" }
      );
      navigate("/auth/verify-email");
    } catch (error) {
      console.log("Error during signup:", error);
    } finally {
      setLoading(false); // End loading after the signup process completes
    }
  }


  // Log in function
  async function logIn(email, password) {
    try {
      setLoading(true);  // Start loading

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast('Login failed: ' + error.message, { type: 'error' });
        throw error;
      }

      const { data: user, error: sessionError } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);  // Set user in state
        navigate('/dashboard/home');
      } else {
        console.error("No session after login");
        throw new Error('No user session found.');
      }

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        throw sessionError;
      }
    } catch (error) {
      console.log('Error during login:', error);
    } finally {
      setLoading(false);  // End loading after the login process completes
    }
  }

  // Update Info function
  async function updateInfo(newName, newEmail, newProfile) {
    try {
      let publicUrl = currentUser.user_metadata.profile;

      // Check if a new profile image is provided
      if (newProfile) {
        // Replace spaces and other invalid characters with underscores or remove them
        const sanitizedFileName = newProfile.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "");
        const fileName = `user-${Date.now()}-${sanitizedFileName}`;

        try {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("profile_images")
            .upload(fileName, newProfile, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            console.error("Error uploading profile image:", uploadError.message);
            throw new Error("Failed to upload profile image.");
          }

          const { data: urlData } = supabase.storage
            .from("profile_images")
            .getPublicUrl(fileName);
          publicUrl = urlData.publicUrl;
        } catch (uploadError) {
          console.error("Error uploading profile image:", uploadError);
          throw new Error("Failed to upload profile image.");
        }
      }

      // Update user information in Supabase Auth
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
        data: {
          displayName: newName,
          profile: publicUrl, // Update profile URL if available
        },
      });

      if (error) {
        console.error("Error updating user information:", error);
        toast(error.message, { type: "error" });
        throw error;
      }

      toast("Account updated successfully!", { type: "success" });
      navigate("/dashboard/home");
    } catch (error) {
      console.error("Error during update:", error);
      toast("Failed to update account. Please try again.", { type: "error" });
    }
  }




  // Log out function
  async function logOut() {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      navigate('/auth/login');
    } catch (error) {
      toast('Error during logout', { type: 'error' });
    }
  }

  const value = {
    currentUser,
    loading,
    signup,
    logIn,
    logOut,
    updateInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}
