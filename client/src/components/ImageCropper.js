import React, { useState } from 'react';
import Cropper from 'react-easy-crop';

const ImageCropper = ({ image, onComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    onComplete(croppedAreaPixels);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-full max-w-2xl">
        <div className="relative h-96 mb-4">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={3/1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">Zoom:</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-32"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onComplete(crop)}
              className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper; 