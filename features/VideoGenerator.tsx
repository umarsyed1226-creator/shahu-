
import React, { useState, useEffect, useCallback } from 'react';
import { generateVideo } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ApiKeyModal from '../components/ApiKeyModal';
import { VideoGeneratorIcon } from '../components/icons/Icons';

// NOTE: These are example loading messages.
const loadingMessages = [
    "Warming up the digital director...",
    "Storyboarding your vision...",
    "Assembling pixels into scenes...",
    "Rendering the first few frames...",
    "This can take a few minutes, please wait...",
    "Applying cinematic magic...",
    "Finalizing the master cut...",
];

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [error, setError] = useState<string | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [hasCheckedKey, setHasCheckedKey] = useState(false);
  const [keySelected, setKeySelected] = useState(false);

  const checkApiKey = useCallback(async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setIsKeyModalOpen(true);
      }
    }
    setHasCheckedKey(true);
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);
  
  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = window.setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          return loadingMessages[(currentIndex + 1) % loadingMessages.length];
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      setIsKeyModalOpen(false);
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Assume success and allow the user to proceed.
      setKeySelected(true); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    setLoadingMessage(loadingMessages[0]);

    try {
      const generatedVideoUrl = await generateVideo(prompt);
      setVideoUrl(generatedVideoUrl);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
          setError("API Key validation failed. Please select a valid key from a project with billing enabled.");
          setKeySelected(false); // Reset key selection state
          setIsKeyModalOpen(true);
      } else {
          setError('Failed to generate video. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasCheckedKey) {
      return (
          <div className="flex items-center justify-center h-full">
              <LoadingSpinner size="h-12 w-12" />
          </div>
      );
  }

  if (isKeyModalOpen) {
      return <ApiKeyModal onSelectKey={handleSelectKey} />;
  }

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg shadow-lg">
      <header className="p-4 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white">AI Video Generator</h2>
        <p className="text-sm text-gray-400">Turn your ideas into video concepts and clips.</p>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Controls */}
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-b md:border-b-0 md:border-r border-slate-700 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Video Idea</label>
              <textarea
                id="prompt"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A neon hologram of a cat driving at top speed"
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full flex justify-center items-center p-3 bg-cyan-600 text-white rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors"
            >
              {isLoading ? <LoadingSpinner size="h-5 w-5" /> : 'Generate Video'}
            </button>
          </form>
        </div>

        {/* Display Area */}
        <div className="flex-1 p-4 bg-slate-900/50 flex items-center justify-center overflow-auto">
          {isLoading ? (
            <div className="text-center">
              <LoadingSpinner size="h-12 w-12" />
              <p className="mt-4 text-gray-300">{loadingMessage}</p>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center p-4">{error}</div>
          ) : videoUrl ? (
            <video src={videoUrl} controls autoPlay loop className="max-w-full max-h-full rounded-lg shadow-lg" />
          ) : (
             <div className="text-center text-gray-500">
                <VideoGeneratorIcon className="w-24 h-24 mx-auto mb-4"/>
                <p>Your generated video will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
