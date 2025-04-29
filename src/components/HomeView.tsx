import React from 'react';
import { motion } from 'framer-motion';
import { FileCog as FileConversion, FileEdit, ImageOff, FileArchive, FileImage } from 'lucide-react';
import { ToolType } from '../App';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface HomeViewProps {
  setActiveTool: (tool: ToolType) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ setActiveTool }) => {
  const tools = [
    {
      id: 'converter',
      title: 'File Converter',
      description: 'Convert between document, image, audio, video, and archive formats.',
      icon: <FileConversion className="w-8 h-8 text-primary-500" />
    },
    {
      id: 'compressor',
      title: 'File Compressor',
      description: 'Compress images, videos, and PDFs to reduce file size.',
      icon: <FileArchive className="w-8 h-8 text-secondary-500" />
    },
    {
      id: 'bg-remover',
      title: 'Background Remover',
      description: 'Remove backgrounds from images using AI technology.',
      icon: <ImageOff className="w-8 h-8 text-accent-500" />
    },
    {
      id: 'pdf-toolkit',
      title: 'PDF Toolkit',
      description: 'Merge, split, rotate, and edit PDF files with ease.',
      icon: <FileEdit className="w-8 h-8 text-warning-500" />
    },
    {
      id: 'image-editor',
      title: 'Image Editor',
      description: 'Crop, resize, rotate, and apply filters to your images.',
      icon: <FileImage className="w-8 h-8 text-success-500" />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      className="container mx-auto"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
    >
      <motion.div 
        className="text-center mb-12"
        variants={itemVariants}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to <span className="bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-400 dark:to-accent-400 text-transparent bg-clip-text">FlexiFile Tools</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your all-in-one solution for file operations. Choose a tool to get started.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            onClick={() => setActiveTool(tool.id as ToolType)}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        onClick={onClick}
        className="w-full h-full p-6 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200 text-left"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export default HomeView;