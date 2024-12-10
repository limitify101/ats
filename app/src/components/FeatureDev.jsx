import React from 'react';
import { Spinner, Typography } from '@material-tailwind/react';
import {motion} from "motion/react";

function FeatureDev({brandName="ATS"}) {
  return (
    <motion.div className="flex flex-col items-center justify-center mt-40 bg-transparent" initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 0.5 }}>
        <Typography variant="h1" className="font-['Aquire'] bg-gradient-to-r from-black/40 via-black/60 to-black/80 bg-clip-text" style={{ WebkitTextFillColor: "transparent" }}>
            {brandName}
          </Typography>
          <p className='font-normal font-["Nunito"]'>This feature is still in development</p>
      {/* <Spinner color="gray" className="h-12 w-12 mb-4" /> */}
    </motion.div>
  );
}

export default FeatureDev;