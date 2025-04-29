import React, { useState } from 'react';
import { FileEdit, MoveHorizontal, Scissors, RotateCw, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import ToolHeader from '../UI/ToolHeader';
import FileDropzone from '../UI/FileDropzone';
import Button from '../UI/Button';

type PdfOperation = 'merge' | 'split' | 'rotate';

const acceptedFileTypes = {
  'application/pdf': ['.pdf'],
};

const PdfToolkit: React.FC = () => {
  const [operation, setOperation] = useState<PdfOperation>('merge');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [splitPages, setSplitPages] = useState<string>('');

  // Handle file drop
  const handleFilesAccepted = (files: File[]) => {
    setUploadedFiles(files);
    setIsComplete(false);
  };

  // Process PDF files
  const processPdf = () => {
    if (uploadedFiles.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  };

  // Get max files based on operation
  const getMaxFiles = () => {
    if (operation === 'merge') return 10;
    return 1;
  };

  // Get operation-specific instructions
  const getOperationInstructions = () => {
    switch (operation) {
      case 'merge':
        return 'Upload multiple PDF files to combine them into a single document. The files will be merged in the order they are uploaded.';
      case 'split':
        return 'Upload a PDF file to split into separate pages or page ranges. Specify pages separated by commas (e.g., 1,3,5-7).';
      case 'rotate':
        return 'Upload a PDF file to rotate its pages. Choose the rotation angle to apply to all pages.';
      default:
        return '';
    }
  };

  return (
    <motion.div
      className="container mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ToolHeader
        title="PDF Toolkit"
        description="Manipulate PDF files with a comprehensive set of tools."
        icon={<FileEdit className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        {/* Step 1: Select Operation */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            1. Select Operation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              className={`p-4 rounded-lg border flex items-center gap-3 transition-all ${
                operation === 'merge'
                  ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700 dark:border-gray-700 dark:hover:bg-gray-750 dark:text-gray-300'
              }`}
              onClick={() => {
                setOperation('merge');
                setUploadedFiles([]);
                setIsComplete(false);
              }}
            >
              <MoveHorizontal className="w-5 h-5" />
              <span>Merge PDFs</span>
            </button>
            <button
              className={`p-4 rounded-lg border flex items-center gap-3 transition-all ${
                operation === 'split'
                  ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700 dark:border-gray-700 dark:hover:bg-gray-750 dark:text-gray-300'
              }`}
              onClick={() => {
                setOperation('split');
                setUploadedFiles([]);
                setIsComplete(false);
              }}
            >
              <Scissors className="w-5 h-5" />
              <span>Split PDF</span>
            </button>
            <button
              className={`p-4 rounded-lg border flex items-center gap-3 transition-all ${
                operation === 'rotate'
                  ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700 dark:border-gray-700 dark:hover:bg-gray-750 dark:text-gray-300'
              }`}
              onClick={() => {
                setOperation('rotate');
                setUploadedFiles([]);
                setIsComplete(false);
              }}
            >
              <RotateCw className="w-5 h-5" />
              <span>Rotate PDF</span>
            </button>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {getOperationInstructions()}
          </p>
        </div>

        {/* Step 2: Upload Files */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            2. Upload PDF {operation === 'merge' ? 'Files' : 'File'}
          </h2>
          <FileDropzone
            onFilesAccepted={handleFilesAccepted}
            acceptedFileTypes={acceptedFileTypes}
            maxFiles={getMaxFiles()}
            maxSize={50 * 1024 * 1024} // 50MB
            label={`Drag & drop your PDF ${operation === 'merge' ? 'files' : 'file'} here, or click to browse`}
          />
        </div>

        {/* Step 3: Operation-specific settings */}
        {uploadedFiles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              3. {operation === 'merge' ? 'Merge Options' : operation === 'split' ? 'Split Options' : 'Rotation Options'}
            </h2>
            
            {operation === 'split' && (
              <div className="mb-4">
                <label htmlFor="splitPages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pages to Extract (e.g., 1,3,5-7)
                </label>
                <input
                  type="text"
                  id="splitPages"
                  value={splitPages}
                  onChange={(e) => setSplitPages(e.target.value)}
                  placeholder="Enter page numbers or ranges"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Leave blank to split into individual pages
                </p>
              </div>
            )}
            
            {operation === 'rotate' && (
              <div className="grid grid-cols-3 gap-3">
                <button
                  className={`p-3 rounded-lg border text-center transition-all ${
                    rotationAngle === 90
                      ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700 dark:border-gray-700 dark:hover:bg-gray-750 dark:text-gray-300'
                  }`}
                  onClick={() => setRotationAngle(90)}
                >
                  Rotate 90°
                </button>
                <button
                  className={`p-3 rounded-lg border text-center transition-all ${
                    rotationAngle === 180
                      ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700 dark:border-gray-700 dark:hover:bg-gray-750 dark:text-gray-300'
                  }`}
                  onClick={() => setRotationAngle(180)}
                >
                  Rotate 180°
                </button>
                <button
                  className={`p-3 rounded-lg border text-center transition-all ${
                    rotationAngle === 270
                      ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700 dark:border-gray-700 dark:hover:bg-gray-750 dark:text-gray-300'
                  }`}
                  onClick={() => setRotationAngle(270)}
                >
                  Rotate 270°
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Process button */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              {isComplete && (
                <div className="bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-success-500 rounded-full"></span>
                  PDF processing complete! Your file is ready for download.
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {!isComplete ? (
                <Button
                  variant="primary"
                  onClick={processPdf}
                  isLoading={isProcessing}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : operation === 'merge' ? 'Merge PDFs' : operation === 'split' ? 'Split PDF' : 'Rotate PDF'}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() => alert("In a real application, this would download the processed PDF.")}
                >
                  Download Processed PDF
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PdfToolkit;