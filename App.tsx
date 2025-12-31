
import React, { useState } from 'react';
import { Tool } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Chatbot from './features/Chatbot';
import ImageGenerator from './features/ImageGenerator';
import WebsiteGenerator from './features/WebsiteGenerator';
import ContentWriter from './features/ContentWriter';
import AppGenerator from './features/AppGenerator';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const renderContent = () => {
    switch (activeTool) {
      case Tool.Chatbot:
        return <Chatbot />;
      case Tool.ImageGenerator:
        return <ImageGenerator />;
      case Tool.WebsiteGenerator:
        return <WebsiteGenerator />;
      case Tool.ContentWriter:
        return <ContentWriter />;
      case Tool.AppGenerator:
        return <AppGenerator />;
      default:
        return <Dashboard onSelectTool={setActiveTool} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-gray-200 font-sans">
      <Sidebar activeTool={activeTool} onSelectTool={setActiveTool} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
