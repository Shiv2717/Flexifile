import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FileConverter from './components/tools/FileConverter';
import FileCompressor from './components/tools/FileCompressor';
import BackgroundRemover from './components/tools/BackgroundRemover';
import PdfToolkit from './components/tools/PdfToolkit';
import ImageEditor from './components/tools/ImageEditor';
import HomeView from './components/HomeView';
import { ThemeProvider } from './contexts/ThemeContext';
import Footer from './components/Footer';

export type ToolType = 
  | 'converter' 
  | 'compressor' 
  | 'bg-remover' 
  | 'pdf-toolkit'
  | 'image-editor'
  | 'home';

function App() {
  const [activeTool, setActiveTool] = useState<ToolType>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when user selects a tool
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTool]);

  // Render the current tool component based on activeTool state
  const renderTool = () => {
    switch (activeTool) {
      case 'converter':
        return <FileConverter />;
      case 'compressor':
        return <FileCompressor />;
      case 'bg-remover':
        return <BackgroundRemover />;
      case 'pdf-toolkit':
        return <PdfToolkit />;
      case 'image-editor':
        return <ImageEditor />;
      default:
        return <HomeView setActiveTool={setActiveTool} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-surface-light dark:bg-surface-dark transition-colors duration-300">
        <Header 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
        
        <div className="flex flex-1 w-full">
          <Sidebar 
            activeTool={activeTool} 
            setActiveTool={setActiveTool} 
            isMobileMenuOpen={isMobileMenuOpen}
          />
          
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              {renderTool()}
            </AnimatePresence>
          </main>
        </div>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;