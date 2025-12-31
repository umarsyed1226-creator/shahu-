
import React, { useState } from 'react';
import { Tool } from '../types';
import { HomeIcon, ChatbotIcon, ImageGeneratorIcon, WebsiteGeneratorIcon, ContentWriterIcon, AppGeneratorIcon, MenuIcon, XIcon } from './icons/Icons';

interface SidebarProps {
  activeTool: Tool | null;
  onSelectTool: (tool: Tool | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: null, label: 'Dashboard', icon: HomeIcon },
    { name: Tool.Chatbot, label: 'AI Chatbot', icon: ChatbotIcon },
    { name: Tool.ImageGenerator, label: 'Image Generator', icon: ImageGeneratorIcon },
    { name: Tool.WebsiteGenerator, label: 'Website Generator', icon: WebsiteGeneratorIcon },
    { name: Tool.ContentWriter, label: 'Content Writer', icon: ContentWriterIcon },
    { name: Tool.AppGenerator, label: 'App Generator', icon: AppGeneratorIcon },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-3 text-cyan-400">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.59L7.71 13.3a.996.996 0 111.41-1.41L11 13.17V7.5a1 1 0 012 0v5.67l1.88-1.88a.996.996 0 111.41 1.41L13 16.59V17a1 1 0 01-2 0v-.41z" />
        </svg>
        <h1 className="text-2xl font-bold text-white">NexusAI</h1>
      </div>
      <nav className="flex-1 space-y-2 px-2">
        {navItems.map(item => (
          <button
            key={item.label}
            onClick={() => {
              onSelectTool(item.name);
              setIsOpen(false);
            }}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeTool === item.name
                ? 'bg-slate-700 text-white'
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md bg-slate-800 text-white">
          {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-slate-800 border-r border-slate-700 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <NavContent />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-shrink-0 w-64 bg-slate-800 border-r border-slate-700">
        <NavContent />
      </aside>
    </>
  );
};

export default Sidebar;
