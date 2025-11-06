'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import toast from 'react-hot-toast';
import { 
  FaTimes, FaPen, FaEraser, FaCheck, FaChevronLeft, FaChevronRight,
  FaSearchPlus, FaSearchMinus, FaExpand
} from 'react-icons/fa';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface SignatureElement {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

interface PDFSignatureModalProps {
  documentUrl: string;
  documentTitle: string;
  onSign: (signedPdfBlob: Blob, signatureDataUrl: string) => Promise<void>;
  onCancel: () => void;
  comments: string;
  onCommentsChange: (comments: string) => void;
}

export default function PDFSignatureModal({
  documentUrl,
  documentTitle,
  onSign,
  onCancel,
  comments,
  onCommentsChange
}: PDFSignatureModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureElements, setSignatureElements] = useState<SignatureElement[]>([]);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [signing, setSigning] = useState(false);
  const [viewMode, setViewMode] = useState<'sign' | 'review'>('review');
  
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    console.log(`PDF loaded: ${numPages} pages`);
  };

  const handlePDFClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== 'sign') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    console.log('PDF clicked at:', { x, y, page: pageNumber });
    setClickPosition({ x, y });
    setShowSignaturePad(true);
  };

  const handleSaveSignature = () => {
    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
      toast.error('Please draw your signature first');
      return;
    }

    if (!clickPosition) {
      toast.error('Please click where you want to place the signature');
      return;
    }

    try {
      const signatureDataUrl = signaturePadRef.current.toDataURL('image/png');
      
      const newElement: SignatureElement = {
        id: `sig-${Date.now()}`,
        src: signatureDataUrl,
        x: clickPosition.x,
        y: clickPosition.y,
        width: 200,
        height: 80,
        page: pageNumber
      };

      setSignatureElements([...signatureElements, newElement]);
      setShowSignaturePad(false);
      setClickPosition(null);
      signaturePadRef.current.clear();
      
      toast.success('Signature placed! You can add more or submit.');
    } catch (error) {
      console.error('Error saving signature:', error);
      toast.error('Failed to place signature. Please try again.');
    }
  };

  const handleDeleteElement = (id: string) => {
    setSignatureElements(signatureElements.filter(el => el.id !== id));
    toast.success('Signature removed');
  };

  const handleSubmitSigned = async () => {
    if (signatureElements.length === 0) {
      toast.error('Please place at least one signature on the document');
      return;
    }

    try {
      setSigning(true);
      toast.loading('Processing signed document...');

      // Dynamic import to avoid webpack issues
      const { PDFDocument } = await import('pdf-lib');
      
      const pdfBytes = await fetch(documentUrl).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Add each signature to the PDF
      for (const el of signatureElements) {
        const page = pdfDoc.getPages()[el.page - 1];
        if (!page) continue;

        const pngImageBytes = await fetch(el.src).then((r) => r.arrayBuffer());
        const embedded = await pdfDoc.embedPng(pngImageBytes);

        const { width: pageW, height: pageH } = page.getSize();
        
        // Calculate actual position on PDF
        const pdfX = (el.x / 800) * pageW;
        const pdfY = pageH - ((el.y / 1100) * pageH) - (el.height / 800 * pageW);

        const sigWidth = (el.width / 800) * pageW;
        const sigHeight = (el.height / 800) * pageH;

        page.drawImage(embedded, {
          x: pdfX,
          y: pdfY,
          width: sigWidth,
          height: sigHeight,
        });
      }

      const signedBytes = await pdfDoc.save();
      const signedBlob = new Blob([signedBytes], { type: 'application/pdf' });

      // Get the first signature for metadata
      const firstSignatureDataUrl = signatureElements[0].src;

      toast.dismiss();
      await onSign(signedBlob, firstSignatureDataUrl);
      
      // Clear signatures after successful submission
      setSignatureElements([]);
    } catch (error) {
      console.error('Error processing signed PDF:', error);
      toast.dismiss();
      toast.error('Failed to process signed document. Please try again.');
    } finally {
      setSigning(false);
    }
  };

  const currentPageSignatures = useMemo(() => {
    return signatureElements.filter(el => el.page === pageNumber);
  }, [signatureElements, pageNumber]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{documentTitle}</h2>
              <p className="text-sm text-blue-100 mt-1">
                {viewMode === 'review' ? 'Review Document' : 'Click to place signature'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* PDF Viewer */}
          <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
            {/* Toolbar */}
            <div className="bg-white border-b p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'review' ? 'sign' : 'review')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                    viewMode === 'sign'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <FaPen /> {viewMode === 'sign' ? 'Signing Mode' : 'Click to Sign'}
                </button>
                
                {signatureElements.length > 0 && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {signatureElements.length} signature{signatureElements.length !== 1 ? 's' : ''} placed
                  </span>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                  title="Zoom Out"
                >
                  <FaSearchMinus />
                </button>
                <span className="text-sm font-medium px-2">{Math.round(scale * 100)}%</span>
                <button
                  onClick={() => setScale(s => Math.min(2.0, s + 0.1))}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                  title="Zoom In"
                >
                  <FaSearchPlus />
                </button>
                <button
                  onClick={() => setScale(1.0)}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                  title="Reset Zoom"
                >
                  <FaExpand />
                </button>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                  disabled={pageNumber <= 1}
                  className="p-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
                >
                  <FaChevronLeft />
                </button>
                <span className="text-sm font-medium px-2">
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                  disabled={pageNumber >= numPages}
                  className="p-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {/* PDF Display */}
            <div className="flex-1 overflow-auto bg-gray-200 p-4">
              <div 
                ref={pdfContainerRef}
                className={`inline-block relative bg-white shadow-lg ${
                  viewMode === 'sign' ? 'cursor-crosshair' : 'cursor-default'
                }`}
                onClick={handlePDFClick}
              >
                <Document
                  file={documentUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center p-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  }
                >
                  <Page 
                    pageNumber={pageNumber} 
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>

                {/* Signature Elements on Current Page */}
                {currentPageSignatures.map((element) => (
                  <div
                    key={element.id}
                    className="absolute border-2 border-blue-500 bg-blue-50 bg-opacity-30 group"
                    style={{
                      left: element.x * scale,
                      top: element.y * scale,
                      width: element.width * scale,
                      height: element.height * scale,
                    }}
                  >
                    <img src={element.src} alt="Signature" className="w-full h-full object-contain" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteElement(element.id);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      title="Remove Signature"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 bg-white border-l flex flex-col overflow-y-auto">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">📋 Instructions</h3>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  <li>Click "<FaPen className="inline" /> Click to Sign" button</li>
                  <li>Click on the PDF where you want to sign</li>
                  <li>Draw your signature in the popup</li>
                  <li>Signature appears on the PDF</li>
                  <li>Add more signatures if needed</li>
                  <li>Add comments (optional)</li>
                  <li>Click "Submit Signed Document"</li>
                </ol>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => onCommentsChange(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Add any comments or notes about this document..."
                />
              </div>

              {/* Signature List */}
              {signatureElements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Placed Signatures ({signatureElements.length})
                  </h4>
                  <div className="space-y-2">
                    {signatureElements.map((el, index) => (
                      <div
                        key={el.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <img src={el.src} alt="Signature" className="h-8 w-16 object-contain bg-white border rounded" />
                          <span className="text-xs text-gray-600">
                            Page {el.page}, Position ({Math.round(el.x)}, {Math.round(el.y)})
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteElement(el.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove"
                        >
                          <FaEraser size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  💡 Tips
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Use zoom controls to see details</li>
                  <li>• Place multiple signatures if needed</li>
                  <li>• Remove signatures with the eraser icon</li>
                  <li>• Navigate pages to sign each one</li>
                  <li>• Review before submitting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium"
          >
            Cancel
          </button>
          <div className="flex-1"></div>
          {signatureElements.length > 0 && (
            <button
              onClick={() => setSignatureElements([])}
              className="flex items-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition font-medium"
            >
              <FaEraser /> Clear All
            </button>
          )}
          <button
            onClick={handleSubmitSigned}
            disabled={signing || signatureElements.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <FaCheck /> {signing ? 'Processing...' : 'Submit Signed Document'}
          </button>
        </div>
      </div>

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
              <h3 className="text-xl font-bold">Draw Your Signature</h3>
              <p className="text-sm text-blue-100 mt-1">Sign in the box below</p>
            </div>

            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-2">
                <SignatureCanvas
                  ref={signaturePadRef}
                  canvasProps={{
                    className: 'w-full h-48 bg-white rounded-lg',
                    style: { touchAction: 'none' }
                  }}
                  backgroundColor="rgb(255, 255, 255)"
                  penColor="black"
                />
              </div>
              <button
                onClick={() => signaturePadRef.current?.clear()}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Signature
              </button>
            </div>

            <div className="p-6 border-t bg-gray-50 rounded-b-xl flex gap-3">
              <button
                onClick={() => {
                  setShowSignaturePad(false);
                  setClickPosition(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSignature}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <FaCheck /> Place Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

