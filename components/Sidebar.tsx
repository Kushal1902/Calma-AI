import React from 'react';
import { SUGGESTED_RESOURCES } from '../constants';
import { Music, Gamepad2, HeartHandshake, ExternalLink } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out border-r border-slate-100 dark:border-slate-800 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 md:w-80`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <HeartHandshake className="text-teal-500" />
            Calm Corner
          </h2>
          <button onClick={onClose} className="md:hidden text-slate-500">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Tools</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 italic">
              "You are not alone. Take a deep breath."
            </p>
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-900">
              <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-1">Grounding Technique</h4>
              <p className="text-xs text-teal-700 dark:text-teal-300">
                5 things you see,<br/>
                4 things you touch,<br/>
                3 things you hear,<br/>
                2 things you smell,<br/>
                1 thing you taste.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recommended Music</h3>
            <div className="space-y-2">
              {SUGGESTED_RESOURCES.filter(r => r.category === 'music').map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 flex items-center justify-center">
                    <Music size={14} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 block">{resource.label}</span>
                    <span className="text-xs text-slate-400">Open Spotify</span>
                  </div>
                  <ExternalLink size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Distractions & Games</h3>
            <div className="space-y-2">
              {SUGGESTED_RESOURCES.filter(r => r.category === 'game').map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-500 flex items-center justify-center">
                    <Gamepad2 size={14} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 block">{resource.label}</span>
                    <span className="text-xs text-slate-400">Play Now</span>
                  </div>
                  <ExternalLink size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[10px] text-slate-400">
            Calma AI is not a substitute for professional medical advice. If you are in danger, please call emergency services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
