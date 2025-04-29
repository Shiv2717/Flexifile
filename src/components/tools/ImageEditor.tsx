import React, { useState } from 'react';
import { FileImage, CropIcon, RotateCw, Sliders, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import ToolHeader from '../UI/ToolHeader';
import FileDropzone from '../UI/FileDropzone';
import Button from '../UI/Button';

type EditorTab = 'crop' | 'rotate' | 'filters';

const acceptedFileTypes = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
};

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>('crop');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Editor settings
  const [cropRatio, setCropRatio] = useState<string>('free');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
  });

  // Handle file drop
  const handleFilesAccepted = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setImage(file);
      setIsComplete(false);
      
      // Create preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Generate CSS filter string
  const getFilterString = () => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`;
  };

  // Update filter values
  const updateFilter = (filter: keyof typeof filters, value: number) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  // Simulate processing
  const processImage = () => {
    if (!image || !imagePreview) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 1500);
  };

  return (
    <motion.div
      className="container mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ToolHeader
        title="Image Editor"
        description="Edit your images with intuitive tools for cropping, rotating, and applying filters."
        icon={<FileImage className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        {/* Step 1: Upload Image */}
        {!imagePreview && (
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

        {/* Step 2: Edit Image */}
        {imagePreview && (
          <>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Preview Panel */}
              <div className="md:w-3/5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Image Preview
                </h2>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-auto rounded max-h-[400px]"
                      style={{
                        transform: `rotate(${rotationAngle}deg)`,
                        filter: getFilterString(),
                      }}
                    />
                    {activeTab === 'crop' && (
                      <div className="absolute inset-0 border-2 border-dashed border-primary-500 pointer-events-none"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Controls */}
              <div className="md:w-2/5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Edit Tools
                </h2>
                
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                      activeTab === 'crop'
                        ? 'border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('crop')}
                  >
                    <CropIcon className="w-4 h-4" />
                    Crop
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                      activeTab === 'rotate'
                        ? 'border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('rotate')}
                  >
                    <RotateCw className="w-4 h-4" />
                    Rotate
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                      activeTab === 'filters'
                        ? 'border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('filters')}
                  >
                    <Sliders className="w-4 h-4" />
                    Filters
                  </button>
                </div>

                {/* Tab Content */}
                <div className="space-y-4">
                  {/* Crop Controls */}
                  {activeTab === 'crop' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Aspect Ratio
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['free', '1:1', '4:3', '16:9', '3:2', '2:3'].map((ratio) => (
                          <button
                            key={ratio}
                            className={`p-2 rounded border text-center text-sm transition-all ${
                              cropRatio === ratio
                                ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700 dark:border-gray-700 dark:hover:bg-gray-750 dark:text-gray-300'
                            }`}
                            onClick={() => setCropRatio(ratio)}
                          >
                            {ratio === 'free' ? 'Free' : ratio}
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        In a real application, you would be able to adjust the crop area on the image.
                      </p>
                    </div>
                  )}

                  {/* Rotate Controls */}
                  {activeTab === 'rotate' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rotation: {rotationAngle}°
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={rotationAngle}
                        onChange={(e) => setRotationAngle(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <div className="flex justify-between mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRotationAngle((prev) => (prev + 270) % 360)}
                        >
                          -90°
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRotationAngle(0)}
                        >
                          Reset
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRotationAngle((prev) => (prev + 90) % 360)}
                        >
                          +90°
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Filters Controls */}
                  {activeTab === 'filters' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Brightness: {filters.brightness}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="5"
                          value={filters.brightness}
                          onChange={(e) => updateFilter('brightness', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contrast: {filters.contrast}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="5"
                          value={filters.contrast}
                          onChange={(e) => updateFilter('contrast', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Saturation: {filters.saturation}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="5"
                          value={filters.saturation}
                          onChange={(e) => updateFilter('saturation', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Blur: {filters.blur}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.5"
                          value={filters.blur}
                          onChange={(e) => updateFilter('blur', parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setFilters({
                          brightness: 100,
                          contrast: 100,
                          saturation: 100,
                          blur: 0,
                        })}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <div className="mt-6">
                  {!isComplete ? (
                    <Button
                      variant="primary"
                      onClick={processImage}
                      isLoading={isProcessing}
                      disabled={isProcessing}
                      fullWidth
                    >
                      {isProcessing ? 'Processing...' : 'Apply Changes'}
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      leftIcon={<Download className="w-4 h-4" />}
                      onClick={() => alert("In a real application, this would download the edited image.")}
                      fullWidth
                    >
                      Download Edited Image
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ImageEditor;