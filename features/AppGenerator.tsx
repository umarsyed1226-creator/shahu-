
import React, { useState } from 'react';
import { generateAppPlan } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { CopyIcon } from '../components/icons/Icons';

const AppGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedPlan = await generateAppPlan(prompt);
      setResult(generatedPlan);
    } catch (err) {
      setError('Failed to generate app plan. Please try a different idea.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg shadow-lg">
      <header className="p-4 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white">AI App Generator</h2>
        <p className="text-sm text-gray-400">Blueprint your next application from a simple idea.</p>
      </header>
      
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Controls */}
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-b md:border-b-0 md:border-r border-slate-700 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">App Idea</label>
              <textarea
                id="prompt"
                rows={10}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A mobile app for tracking personal reading habits and sharing book reviews with friends."
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full flex justify-center items-center p-3 bg-cyan-600 text-white rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors"
            >
              {isLoading ? <LoadingSpinner size="h-5 w-5" /> : 'Generate App Plan'}
            </button>
          </form>
        </div>

        {/* Display Area */}
        <div className="flex-1 p-4 bg-slate-900/50 flex flex-col overflow-auto">
          {isLoading && <div className="m-auto"><LoadingSpinner size="h-12 w-12" /></div>}
          {error && <div className="m-auto text-red-400 p-4">{error}</div>}
          {result && (
              <div className="relative bg-slate-700 rounded-lg p-6 h-full text-gray-200 whitespace-pre-wrap overflow-y-auto">
                  <button onClick={handleCopy} className="absolute top-2 right-2 p-2 text-gray-300 hover:text-white transition-colors" title="Copy plan">
                      {copied ? <span className="text-xs">Copied!</span> : <CopyIcon className="w-5 h-5" />}
                  </button>
                  {result}
              </div>
          )}
          {!isLoading && !result && !error && (
              <div className="m-auto text-center text-gray-500">
                  <p>Your generated app plan will appear here.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppGenerator;
