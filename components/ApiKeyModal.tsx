
import React from 'react';

interface ApiKeyModalProps {
  onSelectKey: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSelectKey }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl p-8 max-w-md w-full border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">API Key Required</h2>
        <p className="text-gray-300 mb-6">
          Video generation with Veo is a powerful feature that requires a paid Google Cloud project. Please select an API key associated with a project that has billing enabled.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          For more information on billing, please visit the{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            official documentation
          </a>.
        </p>
        <button
          onClick={onSelectKey}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
        >
          Select API Key
        </button>
      </div>
    </div>
  );
};

export default ApiKeyModal;
