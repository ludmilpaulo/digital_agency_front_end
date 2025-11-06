'use client';
import React, { useRef, useState, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';
import NextImage from 'next/image';

interface Props {
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  fonts?: string[];
  canvasWidth?: number;
  canvasHeight?: number;
}

const SignaturePadModal: React.FC<Props> = ({
  onClose,
  onSave,
  fonts = ['Great Vibes', 'Pacifico', 'Caveat', 'Dancing Script'],
  canvasWidth = 400,
  canvasHeight = 100,
}) => {
  const [mode, setMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const sigPadRef = useRef<SignaturePad | null>(null);
  const [typedText, setTypedText] = useState('Your Name');
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fonts.forEach((font) => {
      const linkId = `font-${font.replace(/\s+/g, '-')}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}&display=swap`;
        document.head.appendChild(link);
      }
    });
    
    // Mark as ready after a short delay to ensure canvas is initialized
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, [fonts]);

  const clearDraw = () => sigPadRef.current?.clear();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result as string;
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const targetWidth = canvasWidth;
        const targetHeight = canvasHeight;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.clearRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
          if (r > 240 && g > 240 && b > 240) data[i + 3] = 0;
        }

        ctx.putImageData(imgData, 0, 0);
        setUploadedImage(canvas.toDataURL('image/png'));
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (mode === 'draw') {
      if (!sigPadRef.current) {
        alert('Signature pad not initialized. Please try again.');
        return;
      }
      
      if (sigPadRef.current.isEmpty()) {
        alert('Please draw your signature first.');
        return;
      }
      
      try {
        // Try to get trimmed canvas first
        let dataUrl: string | undefined;
        
        try {
          const trimmedCanvas = sigPadRef.current.getTrimmedCanvas();
          if (trimmedCanvas) {
            dataUrl = trimmedCanvas.toDataURL('image/png');
          }
        } catch (trimError) {
          console.warn('getTrimmedCanvas failed, using regular canvas:', trimError);
          // Fallback to regular canvas if trimmed fails
          dataUrl = sigPadRef.current.toDataURL('image/png');
        }
        
        // Validate the data URL
        if (!dataUrl || dataUrl === 'data:,' || dataUrl === 'data:image/png;base64,') {
          alert('Failed to generate signature image. Please try drawing again.');
          return;
        }
        
        console.log('Signature captured successfully');
        onSave(dataUrl);
        onClose();
      } catch (error) {
        console.error('Error capturing signature:', error);
        alert('Error capturing signature. Please try drawing again or use a different mode (Type/Upload).');
      }
      return;
    }

    if (mode === 'type') {
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `48px "${selectedFont}", sans-serif`;

      // Ensure font is loaded before drawing
      document.fonts.ready.then(() => {
        ctx.fillText(typedText, canvas.width / 2, canvas.height / 2);
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
        onClose();
      });
      return;
    }

    if (mode === 'upload' && uploadedImage) {
      onSave(uploadedImage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
        <h2 className="text-lg font-bold">Create Signature</h2>

        {/* Tabs */}
        <div className="flex gap-2">
          {['draw', 'type', 'upload'].map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab as 'draw' | 'type' | 'upload')}
              className={`px-3 py-1 rounded ${
                mode === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Draw mode */}
        {mode === 'draw' && (
          <div>
            <div 
              className="border-2 border-gray-300 rounded overflow-hidden"
              style={{
                background: 'repeating-conic-gradient(#f0f0f0 0% 25%, transparent 0% 50%) 50% / 20px 20px'
              }}
            >
              <SignaturePad
                ref={sigPadRef}
                canvasProps={{
                  width: canvasWidth,
                  height: canvasHeight,
                  className: '',
                  style: { touchAction: 'none' }
                }}
                penColor="black"
              />
            </div>
            <button onClick={clearDraw} className="mt-2 text-sm text-blue-600 hover:underline">
              Clear Signature
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Draw your signature in the box above (transparent background)
            </p>
          </div>
        )}

        {/* Type mode */}
        {mode === 'type' && (
          <div className="space-y-2">
            <input
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter your name"
            />
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full border p-2 rounded"
            >
              {fonts.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <div
              className="border p-4 text-center text-2xl rounded"
              style={{
                fontFamily: selectedFont,
                background: 'repeating-conic-gradient(#f0f0f0 0% 25%, transparent 0% 50%) 50% / 20px 20px'
              }}
            >
              {typedText}
            </div>
            <p className="text-xs text-gray-500">Preview (will have transparent background)</p>
          </div>
        )}

        {/* Upload mode */}
        {mode === 'upload' && (
          <div className="space-y-2">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleUpload}
              className="w-full border p-2 rounded"
            />
            <canvas ref={canvasRef} className="hidden" />
            {uploadedImage && (
              <div>
                <div 
                  className="relative w-full h-32 border-2 border-gray-300 rounded overflow-hidden"
                  style={{
                    background: 'repeating-conic-gradient(#f0f0f0 0% 25%, transparent 0% 50%) 50% / 20px 20px'
                  }}
                >
                  <NextImage src={uploadedImage} alt="Preview" fill className="object-contain" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Preview (white background removed)</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="text-gray-700 px-4 py-2">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              !isReady ||
              (mode === 'draw' && sigPadRef.current?.isEmpty()) ||
              (mode === 'upload' && !uploadedImage)
            }
            className={`px-4 py-2 rounded transition ${
              !isReady ||
              (mode === 'draw' && sigPadRef.current?.isEmpty()) ||
              (mode === 'upload' && !uploadedImage)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Save Signature
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePadModal;
