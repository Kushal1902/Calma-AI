import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Sidebar - Hidden on mobile by default */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        <ChatInterface onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </main>
    </div>
  );
};

export default App;
