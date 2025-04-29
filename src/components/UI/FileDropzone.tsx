import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Upload, X, FileIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  acceptedFileTypes: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  label?: string;
  className?: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesAccepted,
  acceptedFileTypes,
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB default
  label = 'Drag & drop files here, or click to browse',
  className = '',
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const rejectionErrors = rejectedFiles[0].errors;
        if (rejectionErrors[0]?.code === 'file-too-large') {
          setError(`File is too large. Max size is ${maxSize / (1024 * 1024)}MB.`);
        } else if (rejectionErrors[0]?.code === 'file-invalid-type') {
          setError('Invalid file type. Please check accepted file types.');
        } else {
          setError(rejectionErrors[0]?.message || 'Error uploading file.');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const newFiles = maxFiles === 1 ? acceptedFiles.slice(0, 1) : [...files, ...acceptedFiles].slice(0, maxFiles);
        setFiles(newFiles);
        onFilesAccepted(newFiles);
        setError(null);
      }
    },
    [files, maxFiles, maxSize, onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles,
    maxSize,
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesAccepted(newFiles);
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

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-400 bg-primary-50 dark:border-primary-500 dark:bg-primary-900/20'
            : 'border-gray-300 hover:border-primary-300 dark:border-gray-700 dark:hover:border-primary-700'
        } ${files.length > 0 ? 'border-primary-300 dark:border-primary-700' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          {maxFiles > 1 && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Max {maxFiles} files up to {maxSize / (1024 * 1024)}MB each
            </p>
          )}
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-sm text-error-600 dark:text-error-400"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Files</h4>
          <ul className="space-y-2">
            <AnimatePresence>
              {files.map((file, index) => (
                <motion.li
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <FileIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;