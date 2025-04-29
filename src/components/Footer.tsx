import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400">
      <div className="container mx-auto">
        <p>© {new Date().getFullYear()} FlexiFile Tools. All rights reserved.</p>
        <p className="mt-1">Your all-in-one solution for file operations.</p>
      </div>
    </footer>
  );
};

export default Footer;