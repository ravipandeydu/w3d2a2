'use client';

import React, { useRef, useEffect } from 'react';
import { QAResponse } from '../types';
import { FiRefreshCw } from 'react-icons/fi';

interface ResponseDisplayProps {
  response: QAResponse;
  imagePreview: string;
  onReset: () => void;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ 
  response, 
  imagePreview, 
  onReset 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw bounding boxes on the canvas
  useEffect(() => {
    if (!canvasRef.current || !imagePreview || !response.boundingBoxes.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imagePreview;
    
    img.onload = () => {
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image
      ctx.drawImage(img, 0, 0, img.width, img.height);
      
      // Draw bounding boxes
      response.boundingBoxes.forEach((box, index) => {
        const [x1, y1, x2, y2] = box.coordinates;
        const width = (x2 - x1) * img.width;
        const height = (y2 - y1) * img.height;
        
        // Generate a color based on the index
        const hue = (index * 137) % 360; // Golden angle approximation for good color distribution
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.lineWidth = 3;
        
        // Draw rectangle
        ctx.strokeRect(x1 * img.width, y1 * img.height, width, height);
        
        // Draw label
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(x1 * img.width, y1 * img.height - 20, 20, 20);
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText((index + 1).toString(), x1 * img.width + 6, y1 * img.height - 5);
      });
    };
  }, [imagePreview, response.boundingBoxes]);
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">AI Response</h3>
        <div>
          <span className="text-sm bg-primary-100 text-primary-800 py-1 px-2 rounded-full">
            {response.model} {response.fallback ? '(Fallback)' : ''}
          </span>
        </div>
      </div>
      
      {response.boundingBoxes.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-2">Visual Analysis</h4>
          <div className="relative border rounded-lg overflow-hidden">
            <canvas 
              ref={canvasRef} 
              className="max-w-full h-auto"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Colored boxes indicate areas referenced in the response
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2">Answer</h4>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 whitespace-pre-wrap">
          {response.answer}
        </div>
      </div>
      
      {response.boundingBoxes.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-2">Detected Areas</h4>
          <div className="space-y-2">
            {response.boundingBoxes.map((box, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border-l-4"
                style={{ 
                  borderLeftColor: `hsl(${(index * 137) % 360}, 100%, 50%)` 
                }}
              >
                <div className="flex items-center">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center mr-2 text-white text-sm font-bold"
                    style={{ 
                      backgroundColor: `hsl(${(index * 137) % 360}, 100%, 50%)` 
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="text-sm">
                    <span className="font-mono text-xs">
                      [{box.coordinates.map(c => c.toFixed(2)).join(', ')}]
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {box.context.length > 100 ? `${box.context.substring(0, 100)}...` : box.context}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-center">
        <button 
          onClick={onReset} 
          className="btn-secondary flex items-center"
        >
          <FiRefreshCw className="mr-2" />
          New Question
        </button>
      </div>
    </div>
  );
};

export default ResponseDisplay;