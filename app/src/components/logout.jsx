import React,{useEffect} from 'react';
import { motion } from "framer-motion";
import { Button, Typography } from "@material-tailwind/react";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LogOut({ isOpen,onClose }) {
  const {logOut} = useAuth();
  const navigate=useNavigate();
  async function handleLogOut(){
    try{
      await logOut();
      navigate("/",{replace:true});
    } catch(error){
      console.log(error);
    }
  }
  useEffect(() => {
    if (isOpen) {
      // Disable scrolling when the component is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when the component is closed
      document.body.style.overflow = "unset";
    }

    // Clean up overflow style when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      
      {/* Logout confirmation box */}
      <motion.div
        className="relative z-10 bg-white rounded-lg shadow-lg p-8 w-80 text-center gap-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <Typography variant="h1" className="font-['Aquire'] bg-gradient-to-r from-black/40 via-black/60 to-black/80 bg-clip-text" style={{ WebkitTextFillColor: "transparent" }}>
            ATS
          </Typography>
        <Typography variant="h6" color="gray" className="mb-4 font-normal font-['Nunito']">
          Are you sure you want to log out?
        </Typography>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Button color="red" onClick={handleLogOut} variant='outlined'>
            Log Out
          </Button>
          <Button color="blue-gray" onClick={onClose} variant='outlined'>
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default LogOut;
