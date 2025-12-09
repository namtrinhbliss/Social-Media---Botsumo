import React, { useState, useEffect } from 'react';
import { Sheet, Menu, MessageSquare, Plus, Clock, FileSpreadsheet, ChevronRight, Layout } from 'lucide-react';
import { SheetViewer } from './components/SheetViewer';
import { AIAssistant } from './components/AIAssistant';
import { SheetHistoryItem, ViewMode } from './types';

export default function App() {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Welcome);
  const [history, setHistory] = useState<SheetHistoryItem[]>([]);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sheet_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleLoadSheet = (url: string) => {
    if (!url) return;
    
    // Basic validation
    if (!url.includes('google.com/spreadsheets')) {
      alert("Please enter a valid Google Sheets URL");
      return;
    }

    setCurrentUrl(url);
    setViewMode(ViewMode.Sheet);
    
    // Add to history
    const newItem: SheetHistoryItem = {
      id: Date.now().toString(),
      url,
      title: `Sheet ${new Date().toLocaleTimeString()}`, // In a real app, we'd try to fetch metadata or let user name it
      lastAccessed: new Date()
    };
    
    const newHistory = [newItem, ...history.filter(h => h.url !== url)].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('sheet_history', JSON.stringify(newHistory));
    setInputUrl('');
  };

  const handleReturnHome = () => {
    setViewMode(ViewMode.Welcome);
    setIsAiOpen(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleReturnHome}
            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors group"
          >
            <div className="bg-green-600 text-white p-1.5 rounded-md shadow-sm group-hover:scale-105 transition-transform">
              <FileSpreadsheet size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-800">SheetMaster<span className="text-green-600">AI</span></span>
          </button>
        </div>

        {viewMode === ViewMode.Sheet && (
           <div className="flex items-center gap-3">
             <button
               onClick={() => setIsAiOpen(!isAiOpen)}
               className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm border ${
                 isAiOpen 
                   ? 'bg-green-50 text-green-700 border-green-200 ring-2 ring-green-100' 
                   : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:text-green-600'
               }`}
             >
               <MessageSquare size={18} className={isAiOpen ? 'fill-current' : ''} />
               <span>AI Assistant</span>
             </button>
           </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {viewMode === ViewMode.Welcome ? (
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-12 py-10">
              
              {/* Hero Section */}
              <div className="text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                  Supercharge your <span className="text-green-600">Spreadsheets</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  View and edit shared Google Sheets in a focused environment. 
                  Use the built-in AI assistant to generate complex formulas, scripts, and analyze data instantly.
                </p>
                
                <div className="max-w-xl mx-auto relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex bg-white rounded-xl shadow-xl overflow-hidden p-2 ring-1 ring-gray-900/5">
                    <input 
                      type="text" 
                      placeholder="Paste Google Sheet Link here..."
                      className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLoadSheet(inputUrl)}
                    />
                    <button 
                      onClick={() => handleLoadSheet(inputUrl)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
                    >
                      Open Sheet <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent History */}
              {history.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-500 uppercase text-xs font-bold tracking-wider">
                    <Clock size={14} />
                    Recent Sheets
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleLoadSheet(item.url)}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-green-200 transition-all text-left group"
                      >
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg group-hover:bg-green-100 transition-colors">
                          <Sheet size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {item.url.includes('/d/') ? 'Google Sheet ' + item.url.split('/d/')[1].substring(0, 8) + '...' : 'Google Sheet'}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">{item.url}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 text-gray-400">
                          <ExternalLinkIcon />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <FeatureCard 
                  icon={<Layout className="text-blue-500" />}
                  title="Distraction Free"
                  desc="A clean interface focused purely on your data editing experience."
                />
                <FeatureCard 
                  icon={<MessageSquare className="text-purple-500" />}
                  title="AI Formula Expert"
                  desc="Stuck? Ask the AI sidebar for VLOOKUPs, REGEX, or Query help."
                />
                <FeatureCard 
                  icon={<Sheet className="text-green-500" />}
                  title="Native Editing"
                  desc="Full editing capabilities preserved via secure Google embedding."
                />
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex relative">
            <SheetViewer url={currentUrl} />
            <AIAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="mb-4 bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);
