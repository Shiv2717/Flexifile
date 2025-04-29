import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCog as FileConversion, FileEdit, ImageOff, FileArchive, FileImage, Home } from 'lucide-react';
import { ToolType } from '../App';

interface SidebarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  isMobileMenuOpen: boolean;
}

interface ToolItem {
  id: ToolType;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTool, 
  setActiveTool, 
  isMobileMenuOpen 
}) => {
  const tools: ToolItem[] = [
    {
      id: 'home',
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      description: 'Get started with FlexiFile Tools'
    },
    {
      id: 'converter',
      name: 'File Converter',
      icon: <FileConversion className="w-5 h-5" />,
      description: 'Convert between file formats'
    },
    {
      id: 'compressor',
      name: 'File Compressor',
      icon: <FileArchive className="w-5 h-5" />,
      description: 'Compress files to reduce size'
    },
    {
      id: 'bg-remover',
      name: 'Background Remover',
      icon: <ImageOff className="w-5 h-5" />,
      description: 'Remove image backgrounds'
    },
    {
      id: 'pdf-toolkit',
      name: 'PDF Toolkit',
      icon: <FileEdit className="w-5 h-5" />,
      description: 'Manipulate PDF files'
    },
    {
      id: 'image-editor',
      name: 'Image Editor',
      icon: <FileImage className="w-5 h-5" />,
      description: 'Edit and enhance images'
    }
  ];

  // Sidebar container variants
  const sidebarVariants = {
    hidden: { 
      x: '-100%',
      opacity: 0 
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  return (
    <>
      {/* Mobile sidebar (overlay) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTool(activeTool)}
            />
            <motion.nav
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-background-dark shadow-lg z-50 pt-16 md:hidden"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <ul className="flex flex-col p-2 gap-1">
                {tools.map((tool) => (
                  <SidebarItem 
                    key={tool.id}
                    tool={tool}
                    isActive={activeTool === tool.id}
                    onClick={() => setActiveTool(tool.id)}
                  />
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar (permanent) */}
      <nav className="hidden md:block w-64 bg-white dark:bg-background-dark border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
        <ul className="flex flex-col p-3 gap-1">
          {tools.map((tool) => (
            <SidebarItem 
              key={tool.id}
              tool={tool}
              isActive={activeTool === tool.id}
              onClick={() => setActiveTool(tool.id)}
            />
          ))}
        </ul>
      </nav>
    </>
  );
};

interface SidebarItemProps {
  tool: ToolItem;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ tool, isActive, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
          isActive 
            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
        }`}
      >
        <span className={`${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`}>
          {tool.icon}
        </span>
        <div>
          <span className="font-medium block">{tool.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 block">
            {tool.description}
          </span>
        </div>
      </button>
    </li>
  );
};

export default Sidebar;