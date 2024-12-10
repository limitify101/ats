import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@material-tailwind/react';
import { supabase } from '@/supabase';  // Assuming supabase is set up correctly
import { toast } from 'react-toastify';

export function VerifyEmail() {
  const [userEmail, setUserEmail] = useState('');

  const maskEmail = (email) => {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.slice(0, 3) + '*****';  // Mask part of the local part (before @)
    return `${maskedLocal}@${domain}`;
  };

  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (user && user.email) {
        setUserEmail(user.email);
      }
    };

    fetchUserEmail();
  }, []);

  const resendVerificationEmail = async () => {
    try {
      const { user, error } = await supabase.auth.getUser();

      if (user) {
        const { error: resendError } = await supabase.auth.api.resendConfirmationEmail(user.email);
        
        if (resendError) {
          toast.error(resendError.message);
        } else {
          toast.success('Verification email resent! Please check your inbox.');
        }
      }
    } catch (error) {
      toast.error('Error while resending email.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-lg">
        <Typography variant="h5" color="blue-gray" className="text-center mb-6">
          Verify Your Email
        </Typography>

        {userEmail && (
          <Typography color="gray" className="text-center mb-4">
            Thank you for signing up! We have sent a verification email to{' '}
            <strong>{maskEmail(userEmail)}</strong>. Please check your email (and the spam folder) to verify your account.
          </Typography>
        )}

        <div className="text-center">
          <Button
            color="blue"
            onClick={resendVerificationEmail}
            className="w-full"
          >
            Resend Verification Email
          </Button>
        </div>

        <div className="text-center mt-4">
          <Typography color="gray" className="text-sm">
            If you've already verified your email, you can go back to the <a href="/auth/login" className="text-blue-500 hover:text-blue-700">Login</a> page.
          </Typography>
        </div>
      </div>
    </div>
  );
}
export default VerifyEmail;