
import React, { useState } from 'react';
import { generateWebsiteCode } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { CopyIcon, DownloadIcon } from '../components/icons/Icons';

const WebsiteGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [htmlCode, setHtmlCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setHtmlCode(null);

    try {
      const code = await generateWebsiteCode(prompt);
      setHtmlCode(code);
      setActiveTab('preview');
    } catch (err) {
      setError('Failed to generate website. Please try a different description.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (htmlCode) {
      navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (htmlCode) {
      const blob = new Blob([htmlCode], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nexusai-website.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg shadow-lg">
      <header className="p-4 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white">AI Website Generator</h2>
        <p className="text-sm text-gray-400">Describe a website and watch it come to life.</p>
      </header>
      
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Controls */}
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-b md:border-b-0 md:border-r border-slate-700 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Website Description</label>
              <textarea
                id="prompt"
                rows={10}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A modern landing page for a coffee shop with a dark theme and a contact form."
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full flex justify-center items-center p-3 bg-cyan-600 text-white rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors"
            >
              {isLoading ? <LoadingSpinner size="h-5 w-5" /> : 'Generate Website'}
            </button>
          </form>
        </div>

        {/* Display Area */}
        <div className="flex-1 flex flex-col bg-slate-900/50">
          {htmlCode && (
            <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-700 px-4">
              <div className="flex space-x-1">
                <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'preview' ? 'border-cyan-400 text-white' : 'border-transparent text-gray-400'}`}>Preview</button>
                <button onClick={() => setActiveTab('code')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'code' ? 'border-cyan-400 text-white' : 'border-transparent text-gray-400'}`}>Code</button>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={handleCopy} className="p-2 text-gray-300 hover:text-white transition-colors" title="Copy code">
                  {copied ? <span className="text-xs">Copied!</span> : <CopyIcon className="w-5 h-5" />}
                </button>
                <button onClick={handleDownload} className="p-2 text-gray-300 hover:text-white transition-colors" title="Download HTML">
                  <DownloadIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          <div className="flex-1 relative">
            {isLoading && <div className="absolute inset-0 flex items-center justify-center"><LoadingSpinner size="h-12 w-12" /></div>}
            {error && <div className="absolute inset-0 flex items-center justify-center text-red-400 p-4">{error}</div>}
            {htmlCode && (
              <>
                <div className={`w-full h-full ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
                  <iframe srcDoc={htmlCode} title="Website Preview" className="w-full h-full border-0" />
                </div>
                <div className={`w-full h-full overflow-auto ${activeTab === 'code' ? 'block' : 'hidden'}`}>
                  <pre className="p-4 text-sm"><code className="language-html">{htmlCode}</code></pre>
                </div>
              </>
            )}
            {!isLoading && !htmlCode && !error && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <p>Website preview and code will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteGenerator;
