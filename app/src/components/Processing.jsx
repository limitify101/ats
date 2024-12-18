import React from 'react';
import { Spinner, Typography } from '@material-tailwind/react';
import { motion } from "motion/react";

function Processing() {
    return (
        <motion.div className="flex flex-col items-center justify-center min-h-screen bg-transparent gap-y-2" initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{ duration: 0.5 }}>
            <Typography variant="h4" className="font-['Nunito'] text-black font-normal">
                Processing
            </Typography>
            <Spinner color="gray" className="h-12 w-12 mb-4" />
        </motion.div>
    );
}

export default Processing;