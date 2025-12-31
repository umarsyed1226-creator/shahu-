
import React from 'react';
import { Tool } from '../types';
import ToolCard from './ToolCard';
import { ChatbotIcon, ImageGeneratorIcon, WebsiteGeneratorIcon, ContentWriterIcon, AppGeneratorIcon } from './icons/Icons';

interface DashboardProps {
  onSelectTool: (tool: Tool) => void;
}

const tools = [
  {
    tool: Tool.Chatbot,
    title: 'AI Chatbot',
    description: 'Ask questions, get beginner-friendly explanations, and have a multi-purpose assistant at your side.',
    icon: ChatbotIcon,
  },
  {
    tool: Tool.ImageGenerator,
    title: 'AI Image Generator',
    description: 'Turn your text prompts into stunning visuals. Select styles like realistic, cartoon, logo, and more.',
    icon: ImageGeneratorIcon,
  },
  {
    tool: Tool.WebsiteGenerator,
    title: 'AI Website Generator',
    description: 'Describe a website and get the full HTML, CSS, and JavaScript code, with a live preview.',
    icon: WebsiteGeneratorIcon,
  },
  {
    tool: Tool.ContentWriter,
    title: 'AI Content Writer',
    description: 'Create SEO-friendly blogs, social media posts, and emails with specific tone selections.',
    icon: ContentWriterIcon,
  },
  {
    tool: Tool.AppGenerator,
    title: 'AI App Generator',
    description: 'Describe your app idea and generate features, tech stack, and basic code snippets to get started.',
    icon: AppGeneratorIcon,
  },
];

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  return (
    <div className="h-full flex flex-col">
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
          Welcome to <span className="text-cyan-400">NexusAI</span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
          Your all-in-one platform for AI-powered creation. Select a tool below to begin.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 flex-1">
        {tools.map(toolInfo => (
          <ToolCard
            key={toolInfo.tool}
            title={toolInfo.title}
            description={toolInfo.description}
            icon={toolInfo.icon}
            onClick={() => onSelectTool(toolInfo.tool)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
