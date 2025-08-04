import React from 'react';

interface InsuranceBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InsuranceBotModal: React.FC<InsuranceBotModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Insurance Verification</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ×
          </button>
        </div>
        <div className="text-center">
          <p className="text-slate-600 mb-4">
            Insurance verification feature is temporarily unavailable. Please contact us directly for assistance.
          </p>
          <button
            onClick={onClose}
            className="bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceBotModal;
