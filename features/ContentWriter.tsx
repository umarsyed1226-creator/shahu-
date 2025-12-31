
import React, { useState } from 'react';
import { generateContent } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { CopyIcon } from '../components/icons/Icons';

const contentTypes = ['Blog Post', 'Social Media Post', 'Email', 'Ad Copy'];
const tones = ['Formal', 'Casual', 'Creative', 'Humorous', 'Professional'];

const ContentWriter: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('Blog Post');
  const [tone, setTone] = useState('Professional');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedContent = await generateContent(topic, contentType, tone);
      setResult(generatedContent);
    } catch (err) {
      setError('Failed to generate content. Please try a different topic.');
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
        <h2 className="text-2xl font-bold text-white">AI Content Writer</h2>
        <p className="text-sm text-gray-400">Generate high-quality content for any purpose.</p>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Controls */}
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-b md:border-b-0 md:border-r border-slate-700 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">Topic</label>
              <textarea
                id="topic"
                rows={5}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The benefits of remote work for small businesses"
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
            </div>
            <div>
              <label htmlFor="contentType" className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
              <select
                id="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              >
                {contentTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-300 mb-2">Tone of Voice</label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              >
                {tones.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full flex justify-center items-center p-3 bg-cyan-600 text-white rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors"
            >
              {isLoading ? <LoadingSpinner size="h-5 w-5" /> : 'Generate Content'}
            </button>
          </form>
        </div>

        {/* Display Area */}
        <div className="flex-1 p-4 bg-slate-900/50 flex flex-col overflow-auto">
            {isLoading && <div className="m-auto"><LoadingSpinner size="h-12 w-12" /></div>}
            {error && <div className="m-auto text-red-400 p-4">{error}</div>}
            {result && (
                <div className="relative bg-slate-700 rounded-lg p-6 h-full text-gray-200 whitespace-pre-wrap overflow-y-auto">
                    <button onClick={handleCopy} className="absolute top-2 right-2 p-2 text-gray-300 hover:text-white transition-colors" title="Copy content">
                        {copied ? <span className="text-xs">Copied!</span> : <CopyIcon className="w-5 h-5" />}
                    </button>
                    {result}
                </div>
            )}
            {!isLoading && !result && !error && (
                <div className="m-auto text-center text-gray-500">
                    <p>Your generated content will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ContentWriter;
