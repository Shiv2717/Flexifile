import React, { useState } from 'react';
import { ImageOff, Download, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import ToolHeader from '../UI/ToolHeader';
import FileDropzone from '../UI/FileDropzone';
import Button from '../UI/Button';

const acceptedFileTypes = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

const BackgroundRemover: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Handle file drop
  const handleFilesAccepted = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage(file);
      setIsComplete(false);
      setProcessedPreview(null);
      
      // Create preview URL for the original image
      const previewUrl = URL.createObjectURL(file);
      setOriginalPreview(previewUrl);
    }
  };

  // Simulate background removal process
  // In a real application, this would call an API like remove.bg
  const removeBackground = () => {
    if (!originalImage || !originalPreview) return;
    
    setIsProcessing(true);
    
    // Simulate API processing delay
    setTimeout(() => {
      // For demo purposes, we'll use a placeholder transparent PNG
      // In a real app, this would be the result from the API
      const transparentImageUrl = 'https://images.pexels.com/photos/2799605/pexels-photo-2799605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
      
      setProcessedPreview(transparentImageUrl);
      setIsProcessing(false);
      setIsComplete(true);
    }, 3000);
  };

  // Reset the process
  const resetProcess = () => {
    setOriginalImage(null);
    setOriginalPreview(null);
    setProcessedPreview(null);
    setIsComplete(false);
  };

  return (
    <motion.div
      className="container mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ToolHeader
        title="Background Remover"
        description="Remove backgrounds from your images automatically with AI."
        icon={<ImageOff className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        {/* Step 1: Upload Image */}
        {!originalPreview && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload Your Image
            </h2>
            <FileDropzone
              onFilesAccepted={handleFilesAccepted}
              acceptedFileTypes={acceptedFileTypes}
              maxFiles={1}
              maxSize={20 * 1024 * 1024} // 20MB
              label="Drag & drop your image here, or click to browse"
            />
          </div>
        )}

        {/* Step 2: Preview and Process */}
        {originalPreview && (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Image Preview
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<RefreshCcw className="w-4 h-4" />}
                  onClick={resetProcess}
                >
                  Use Another Image
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original Image</p>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 flex items-center justify-center">
                    <img
                      src={originalPreview}
                      alt="Original"
                      className="max-w-full h-auto max-h-80 object-contain rounded"
                    />
                  </div>
                </div>

                {/* Processed Image */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {processedPreview ? 'Background Removed' : 'Result Preview'}
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 h-full flex items-center justify-center min-h-[200px]">
                    {isProcessing ? (
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <svg className="animate-spin h-10 w-10 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p>Removing background...</p>
                      </div>
                    ) : processedPreview ? (
                      <img
                        src={processedPreview}
                        alt="Background Removed"
                        className="max-w-full h-auto max-h-80 object-contain rounded"
                      />
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                        Click "Remove Background" to process your image
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                {isComplete && (
                  <div className="bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-success-500 rounded-full"></span>
                    Background removal complete! Download your image.
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                {!isComplete ? (
                  <Button
                    variant="primary"
                    onClick={removeBackground}
                    isLoading={isProcessing}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Remove Background'}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => alert("In a real application, this would download the processed image.")}
                  >
                    Download Transparent PNG
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default BackgroundRemover;