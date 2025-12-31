
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { DownloadIcon, ImageGeneratorIcon } from '../components/icons/Icons';

const styles = ['Realistic', 'Cartoon', 'Logo', '3D Render', 'Pixel Art', 'Watercolor'];
const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const fullPrompt = `${prompt}, in a ${style} style.`;
      const generatedImageUrl = await generateImage(fullPrompt, aspectRatio);
      setImageUrl(generatedImageUrl);
    } catch (err) {
      setError('Failed to generate image. Please try a different prompt.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg shadow-lg">
      <header className="p-4 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white">AI Image Generator</h2>
        <p className="text-sm text-gray-400">Create stunning visuals from text.</p>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Controls */}
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-b md:border-b-0 md:border-r border-slate-700 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
              <textarea
                id="prompt"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A robot holding a red skateboard"
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
            </div>
            <div>
              <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-2">Style</label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              >
                {styles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
              <select
                id="aspectRatio"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              >
                {aspectRatios.map(ar => <option key={ar} value={ar}>{ar}</option>)}
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full flex justify-center items-center p-3 bg-cyan-600 text-white rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors"
            >
              {isLoading ? <LoadingSpinner size="h-5 w-5" /> : 'Generate Image'}
            </button>
          </form>
        </div>

        {/* Display Area */}
        <div className="flex-1 p-4 bg-slate-900/50 flex items-center justify-center overflow-auto">
          {isLoading && <LoadingSpinner size="h-12 w-12" />}
          {error && <div className="text-red-400 text-center p-4">{error}</div>}
          {imageUrl && (
            <div className="relative group">
              <img src={imageUrl} alt="Generated" className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
              <a
                href={imageUrl}
                download="nexusai-image.png"
                className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Download image"
              >
                <DownloadIcon className="w-6 h-6" />
              </a>
            </div>
          )}
          {!isLoading && !imageUrl && !error && (
             <div className="text-center text-gray-500">
                <ImageGeneratorIcon className="w-24 h-24 mx-auto mb-4"/>
                <p>Your generated image will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
