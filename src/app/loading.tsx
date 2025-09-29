// src/components/Loading.tsx
"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Spinner Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="text-blue-600"
        >
          <Loader2 className="w-12 h-12" />
        </motion.div>

        

        {/* Please wait Text */}
        <motion.p
          className="mt-1 ml-4 text-gray-900 text-sm italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Please wait a moment ...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loading;
