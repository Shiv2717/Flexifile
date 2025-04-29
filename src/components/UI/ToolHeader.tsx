import React from 'react';
import { motion } from 'framer-motion';

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ToolHeader: React.FC<ToolHeaderProps> = ({ title, description, icon }) => {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
          {icon}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-lg">
        {description}
      </p>
    </motion.div>
  );
};

export default ToolHeader;