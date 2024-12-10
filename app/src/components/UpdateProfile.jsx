import React, { useEffect ,useState} from 'react';
import { motion } from "framer-motion";
import {
    Input,
    Button,
    Typography,Avatar, IconButton,Tooltip 
  } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {useRef} from 'react';
import { toast } from "react-toastify";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";

function UpdateProfile({isOpen,onClose}) {
  // const navigate = useNavigate();
  const {currentUser,updateInfo} = useAuth();
  const [name,setName]= useState(currentUser.user_metadata.displayName);
  const [email,setEmail] = useState(currentUser.email);
  const [error,setError] = useState('');
  // const passwordRef = useRef();
  // const passwordConfirmRef = useRef();
  const [isHovering, setIsHovering] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Preview the selected image
    }
  };
  const handleUploadClick = () => {
    document.getElementById("profile-image-input").click();
  };
  async function handleUpdate(e) {
    e.preventDefault();
  
    try {
      // Pass `selectedImage` only if it has been changed
      const newProfile = selectedImage || null;
  
      // Call `updateInfo` with the new values
      await updateInfo(name, email, newProfile);
  
      setError(null); // Clear any previous errors on success
    } catch (error) {
      setError(error.message); // Display the error if it occurs
    }
  }
  useEffect(() => {
    
    if (isOpen) {
      // Disable scrolling when the component is open
      document.body.style.overflow = "hidden";
      if(error !== ''){
        toast(error,{type:"error"})
      }
    } else {
      // Re-enable scrolling when the component is closed
      document.body.style.overflow = "unset";
    }
    // Clean up overflow style when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
    
  }, [isOpen,error]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      
      {/* Logout confirmation box */}
      <motion.div
        className="relative z-10 bg-white rounded-lg shadow-lg p-8 w-full lg:w-2/5 mx-2 flex items-center flex-col justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <Typography variant="h1" className="font-['Aquire'] bg-gradient-to-r from-black/40 via-black/60 to-black/80 bg-clip-text" style={{ WebkitTextFillColor: "transparent" }}>
            ATS
          </Typography>
        <Typography variant="h6" color="gray" className="mb-1 font-normal font-['Nunito']">
          Edit profile info
        </Typography>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
        <div className='flex flex-col gap-2 m-auto'>
        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Edit Profile
        </Typography>
        <div
            className="flex items-center justify-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative flex items-center justify-center">
              <Avatar
                src={previewImage || currentUser && currentUser.user_metadata.profile||`/img/no-profile.jpg`}
                alt={name || currentUser.email}
                size="xl"
                variant="rounded"
                className="rounded-md shadow-lg shadow-blue-gray-500/40 bg-fixed bg-cover bg-no-repeat"
              />
              {isHovering && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Tooltip content="Upload Image">
                      <IconButton
                        onClick={handleUploadClick}
                        className="bg-white shadow-lg shadow-blue-gray-500/40 z-50"
                      >
                        <ArrowUpOnSquareIcon className="h-5 w-5 text-blue-gray-500" />
                      </IconButton>
                  </Tooltip>
                </div>
              )}
              {/* Hidden File Input */}
              <input
                type="file"
                id="profile-image-input"
                accept="image/*"
                className="hidden w-0 h-0 absolute"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Organization Name
            </Typography>
            <Input
              size="lg"
              placeholder="Name"
              value={name}
              onChange={(e)=>setName(e.currentTarget.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.currentTarget.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          {/* <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              New password
            </Typography>
            <Input
              size="lg"
              type="password"
              inputRef={passwordRef}
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Confirm Password
            </Typography>
            <Input
              size="lg"
              placeholder="********"
              inputRef={passwordConfirmRef}
              type="password"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              
            />
          </div> */}
          <div className="flex gap-4 mt-6 items-center">
        <Button color="blue-gray" onClick={onClose} variant='outlined'>
            Cancel
          </Button>
          <Button color="blue" onClick={(e)=>handleUpdate(e)} variant='outlined'>
            Save
          </Button>
        </div>
        </form>

        {/* Action buttons */}
        
      </motion.div>
    </div>
  )
}

export default UpdateProfile