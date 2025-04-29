import React, { useState } from 'react';
import { FileCog as FileConversion, RefreshCw, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import ToolHeader from '../UI/ToolHeader';
import FileDropzone from '../UI/FileDropzone';
import Button from '../UI/Button';

// Define file type groups
const fileTypeGroups = {
  document: {
    label: 'Document',
    types: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
      'application/rtf': ['.rtf'],
    },
    conversions: [
      { value: 'pdf', label: 'PDF' },
      { value: 'docx', label: 'DOCX' },
      { value: 'txt', label: 'TXT' },
      { value: 'rtf', label: 'RTF' },
    ],
  },
  image: {
    label: 'Image',
    types: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
      'image/gif': ['.gif'],
    },
    conversions: [
      { value: 'jpg', label: 'JPG' },
      { value: 'png', label: 'PNG' },
      { value: 'webp', label: 'WEBP' },
      { value: 'svg', label: 'SVG' },
      { value: 'gif', label: 'GIF' },
    ],
  },
  audio: {
    label: 'Audio',
    types: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/ogg': ['.ogg'],
      'audio/aac': ['.aac'],
    },
    conversions: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' },
      { value: 'ogg', label: 'OGG' },
      { value: 'aac', label: 'AAC' },
    ],
  },
  video: {
    label: 'Video',
    types: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/x-msvideo': ['.avi'],
      'video/quicktime': ['.mov'],
    },
    conversions: [
      { value: 'mp4', label: 'MP4' },
      { value: 'webm', label: 'WEBM' },
      { value: 'avi', label: 'AVI' },
      { value: 'mov', label: 'MOV' },
    ],
  },
  archive: {
    label: 'Archive',
    types: {
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'application/x-7z-compressed': ['.7z'],
      'application/x-tar': ['.tar'],
    },
    conversions: [
      { value: 'zip', label: 'ZIP' },
      { value: 'rar', label: 'RAR' },
      { value: '7z', label: '7Z' },
      { value: 'tar', label: 'TAR' },
    ],
  },
};

type FileType = 'document' | 'image' | 'audio' | 'video' | 'archive';

const FileConverter: React.FC = () => {
  const [fileType, setFileType] = useState<FileType>('document');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Handle file drop
  const handleFilesAccepted = (files: File[]) => {
    setUploadedFiles(files);
    setIsComplete(false);
    
    // Determine file type from the first file
    if (files.length > 0) {
      const file = files[0];
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Set file type based on extension
      if (['.pdf', '.docx', '.doc', '.txt', '.rtf'].some(ext => ext.includes(fileExt))) {
        setFileType('document');
        setTargetFormat('pdf');
      } else if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].some(ext => ext.includes(fileExt))) {
        setFileType('image');
        setTargetFormat('png');
      } else if (['.mp3', '.wav', '.ogg', '.aac'].some(ext => ext.includes(fileExt))) {
        setFileType('audio');
        setTargetFormat('mp3');
      } else if (['.mp4', '.webm', '.avi', '.mov'].some(ext => ext.includes(fileExt))) {
        setFileType('video');
        setTargetFormat('mp4');
      } else if (['.zip', '.rar', '.7z', '.tar'].some(ext => ext.includes(fileExt))) {
        setFileType('archive');
        setTargetFormat('zip');
      }
    }
  };

  // Simulate conversion process
  const convertFile = () => {
    if (uploadedFiles.length === 0 || !targetFormat) return;
    
    setIsConverting(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsConverting(false);
      setIsComplete(true);
    }, 2000);
  };

  // Get all accepted file types
  const getAllAcceptedTypes = () => {
    return Object.entries(fileTypeGroups).reduce((acc, [_, group]) => {
      return { ...acc, ...group.types };
    }, {});
  };

  // Format filename with new extension
  const getConvertedFilename = () => {
    if (uploadedFiles.length === 0 || !targetFormat) return '';
    
    const originalName = uploadedFiles[0].name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    
    return `${nameWithoutExt}.${targetFormat}`;
  };

  return (
    <motion.div
      className="container mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ToolHeader
        title="File Converter"
        description="Convert your files between various formats with ease."
        icon={<FileConversion className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        {/* Step 1: Upload Files */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            1. Upload Your File
          </h2>
          <FileDropzone
            onFilesAccepted={handleFilesAccepted}
            acceptedFileTypes={getAllAcceptedTypes()}
            maxFiles={1}
            maxSize={100 * 1024 * 1024} // 100MB
            label="Drag & drop your file here, or click to browse"
          />
        </div>

        {/* Step 2: Select conversion type (only if files uploaded) */}
        {uploadedFiles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              2. Select File Type
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Object.entries(fileTypeGroups).map(([type, group]) => (
                <button
                  key={type}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    fileType === type
                      ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600 dark:border-gray-700 dark:hover:bg-gray-750 dark:text-gray-300'
                  }`}
                  onClick={() => {
                    setFileType(type as FileType);
                    setTargetFormat(fileTypeGroups[type as FileType].conversions[0].value);
                  }}
                >
                  {group.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select output format */}
        {uploadedFiles.length > 0 && fileType && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              3. Select Output Format
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {fileTypeGroups[fileType].conversions.map((format) => (
                <button
                  key={format.value}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    targetFormat === format.value
                      ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600 dark:border-gray-700 dark:hover:bg-gray-750 dark:text-gray-300'
                  }`}
                  onClick={() => setTargetFormat(format.value)}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Convert button */}
        {uploadedFiles.length > 0 && targetFormat && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              {isComplete && (
                <div className="bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-success-500 rounded-full"></span>
                  Conversion complete! Your file is ready for download.
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {!isComplete ? (
                <Button
                  variant="primary"
                  onClick={convertFile}
                  isLoading={isConverting}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                  disabled={isConverting || !targetFormat}
                >
                  {isConverting ? 'Converting...' : 'Convert File'}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() => alert("In a real application, this would download the converted file.")}
                >
                  Download {getConvertedFilename()}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FileConverter;