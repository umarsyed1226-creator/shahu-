
import React from 'react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-slate-800 p-6 rounded-lg text-left h-full flex flex-col border border-slate-700 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
    >
      <div className="flex-shrink-0">
        <Icon className="h-10 w-10 text-cyan-400 mb-4" />
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-gray-400 flex-grow">{description}</p>
      </div>
    </button>
  );
};

export default ToolCard;
