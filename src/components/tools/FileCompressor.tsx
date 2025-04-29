import React, { useState } from 'react';
import { FileArchive, Settings, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import ToolHeader from '../UI/ToolHeader';
import FileDropzone from '../UI/FileDropzone';
import Button from '../UI/Button';

interface CompressionSettings {
  quality: number;
  resizeOption: 'none' | 'small' | 'medium' | 'large';
}

const acceptedFileTypes = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
};

const FileCompressor: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CompressionSettings>({
    quality: 80,
    resizeOption: 'none',
  });

  // Get file type
  const getFileType = (file: File): 'image' | 'pdf' | 'video' | 'unknown' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type.startsWith('video/')) return 'video';
    return 'unknown';
  };

  // Handle file drop
  const handleFilesAccepted = (files: File[]) => {
    setUploadedFiles(files);
    setIsComplete(false);
  };

  // Format file size
  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Calculate estimated file size after compression
  const getEstimatedSize = (originalSize: number): number => {
    const qualityFactor = settings.quality / 100;
    let sizeFactor = qualityFactor;

    // Apply resize option reduction
    if (settings.resizeOption === 'small') {
      sizeFactor *= 0.7;
    } else if (settings.resizeOption === 'medium') {
      sizeFactor *= 0.5;
    } else if (settings.resizeOption === 'large') {
      sizeFactor *= 0.3;
    }

    return Math.max(originalSize * sizeFactor, originalSize * 0.1);
  };

  // Simulate compression process
  const compressFiles = () => {
    if (uploadedFiles.length === 0) return;
    
    setIsCompressing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsCompressing(false);
      setIsComplete(true);
    }, 2000);
  };

  return (
    <motion.div
      className="container mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ToolHeader
        title="File Compressor"
        description="Compress your files to reduce size while preserving quality."
        icon={<FileArchive className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        {/* Step 1: Upload Files */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            1. Upload Your Files
          </h2>
          <FileDropzone
            onFilesAccepted={handleFilesAccepted}
            acceptedFileTypes={acceptedFileTypes}
            maxFiles={5}
            maxSize={100 * 1024 * 1024} // 100MB
            label="Drag & drop your files here, or click to browse"
          />
        </div>

        {/* Step 2: Compression Settings */}
        {uploadedFiles.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                2. Compression Settings
              </h2>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Settings className="w-4 h-4" />}
                onClick={() => setShowSettings(!showSettings)}
              >
                {showSettings ? 'Hide Settings' : 'Show Settings'}
              </Button>
            </div>

            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 mb-4"
              >
                <div className="space-y-4">
                  {/* Quality Slider */}
                  <div>
                    <label htmlFor="quality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quality: {settings.quality}%
                    </label>
                    <input
                      type="range"
                      id="quality"
                      min="10"
                      max="100"
                      step="5"
                      value={settings.quality}
                      onChange={(e) => setSettings({ ...settings, quality: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Small file size</span>
                      <span>High quality</span>
                    </div>
                  </div>

                  {/* Resize Options (for images and videos) */}
                  {uploadedFiles.some(file => getFileType(file) === 'image' || getFileType(file) === 'video') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Resize (optional)
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {['none', 'small', 'medium', 'large'].map((option) => (
                          <button
                            key={option}
                            className={`p-2 rounded-lg border text-center text-sm transition-all ${
                              settings.resizeOption === option
                                ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                                : 'border-gray-200 hover:bg-gray-100 text-gray-700 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300'
                            }`}
                            onClick={() => setSettings({ ...settings, resizeOption: option as any })}
                          >
                            {option === 'none' ? 'Original' : option.charAt(0).toUpperCase() + option.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Estimated Compression Results */}
            {uploadedFiles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Estimated Compression Results
                </h3>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => {
                    const originalSize = file.size;
                    const estimatedSize = getEstimatedSize(originalSize);
                    const savingsPercent = Math.round(((originalSize - estimatedSize) / originalSize) * 100);
                    
                    return (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="truncate max-w-xs">{file.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 dark:text-gray-400">
                            {formatFileSize(originalSize)} →{' '}
                          </span>
                          <span className="text-success-600 dark:text-success-400 font-medium">
                            {formatFileSize(estimatedSize)}
                          </span>
                          <span className="bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-300 px-2 py-0.5 rounded text-xs">
                            {savingsPercent}% smaller
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Compress button */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              {isComplete && (
                <div className="bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-success-500 rounded-full"></span>
                  Compression complete! Your files are ready for download.
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {!isComplete ? (
                <Button
                  variant="primary"
                  onClick={compressFiles}
                  isLoading={isCompressing}
                  disabled={isCompressing}
                >
                  {isCompressing ? 'Compressing...' : 'Compress Files'}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() => alert("In a real application, this would download the compressed files.")}
                >
                  Download Compressed Files
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FileCompressor;