import React from 'react';
import { Spinner, Typography } from '@material-tailwind/react';
import {motion} from "motion/react";

function LoadingScreen({brandName="ATS"}) {
  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen bg-blue-gray-50/50 gap-y-2" initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 0.5 }}>
        <Typography variant="h1" className="font-['Aquire'] bg-gradient-to-r from-black/40 via-black/60 to-black/80 bg-clip-text" style={{ WebkitTextFillColor: "transparent" }}>
            {brandName}
          </Typography>
      <Spinner color="gray" className="h-12 w-12 mb-4" />
    </motion.div>
  );
}

export default LoadingScreen;