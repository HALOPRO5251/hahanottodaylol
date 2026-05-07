import { useState, useMemo } from 'react';
import { Search, Gamepad2, LayoutGrid, Heart, History, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './data/games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(gamesData.map(g => g.category))];

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#00FF00] selection:text-black">
      {/* Header */}
      <header className="border-b border-[#222] bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00FF00] flex items-center justify-center rounded-sm">
              <Gamepad2 size={20} className="text-black" />
            </div>
            <div className="flex flex-col -space-y-1">
              <h1 className="text-xl font-black uppercase tracking-tighter leading-none sm:block">
                Nova<span className="text-[#00FF00]">Arcade</span>
              </h1>
              <span className="text-[8px] font-mono text-[#444] tracking-[0.3em] uppercase pl-1">Unblocked_Access</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={18} />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] border border-[#222] rounded-none py-2 pl-10 pr-4 focus:outline-none focus:border-[#00FF00] transition-colors text-sm font-mono placeholder:text-[#333]"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#666] hover:text-[#00FF00] transition-colors group">
              <History size={14} className="group-hover:rotate-[-45deg] transition-transform" /> History
            </button>
            <button className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#666] hover:text-[#00FF00] transition-colors group">
              <Heart size={14} className="group-hover:scale-125 transition-transform" /> Saved
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-48 shrink-0 space-y-8">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#444] mb-4 border-b border-[#222] pb-1">Categories</h2>
            <div className="flex flex-wrap md:flex-col gap-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-2 text-left text-[11px] font-bold uppercase transition-all border-l-2 ${
                    activeCategory === cat 
                      ? 'bg-[#00FF00]/10 border-[#00FF00] text-[#00FF00]' 
                      : 'border-transparent text-[#555] hover:text-white hover:bg-[#111]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#444] mb-4 border-b border-[#222] pb-1">Telemetry</h2>
            <div className="space-y-4">
              <div className="bg-[#111] p-3 border border-[#222]">
                <div className="text-[9px] text-[#444] uppercase mb-1">Grid_Status</div>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00] shadow-[0_0_8px_#00FF00]" />
                  Active
                </div>
              </div>
              <div className="bg-[#111] p-3 border border-[#222]">
                <div className="text-[9px] text-[#444] uppercase mb-1">Latency</div>
                <div className="text-[10px] font-mono text-[#00FF00]">12ms</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <LayoutGrid size={18} className="text-[#00FF00]" />
              <h2 className="text-xl font-black uppercase tracking-tighter skew-x-[-10deg]">
                Active_Registry
              </h2>
            </div>
            <div className="text-[10px] font-mono text-[#444] bg-[#111] px-2 py-1 border border-[#222]">
              {filteredGames.length} NODES_LOCALIZED
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredGames.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedGame(game)}
                className="group relative cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-2 border-[#222] bg-[#111] transition-colors group-hover:border-[#00FF00]">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 text-[8px] font-mono tracking-widest text-[#00FF00] uppercase">
                    {game.category}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                    <div className="px-6 py-2 bg-[#00FF00] text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_#00FF0044]">
                      Initialize
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-[#00FF00] transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-[10px] font-medium text-[#444] line-clamp-1 max-w-[200px]">
                      {game.description}
                    </p>
                  </div>
                  <div className="text-[9px] font-mono text-[#222] group-hover:text-[#444] transition-colors">
                    #{(i + 1).toString().padStart(3, '0')}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center border border-[#222] bg-[#111]/50 backdrop-blur-sm">
              <div className="text-[#00FF00] text-4xl mb-4 opacity-20">
                <Gamepad2 size={64} />
              </div>
              <div className="text-[#444] mb-2 uppercase font-black text-2xl tracking-tighter">Null_Reference</div>
              <p className="text-[#666] text-[10px] uppercase tracking-[0.3em]">No matching entities in sector {activeCategory}</p>
            </div>
          )}
        </main>
      </div>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            <div className="h-14 border-b border-[#222] px-4 flex items-center justify-between shrink-0 bg-[#0A0A0A]">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#666] hover:text-white transition-colors"
                >
                  <X size={16} className="text-[#00FF00]" />
                  <span>Exit_Process</span>
                </button>
                <div className="w-[1px] h-6 bg-[#222]" />
                <div>
                  <h3 className="text-xs font-black uppercase tracking-tight">
                    {selectedGame.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#00FF00]" />
                    <p className="text-[8px] uppercase font-mono text-[#444]">{selectedGame.category}_MODULE_ACTIVE</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="h-8 px-4 bg-[#111] border border-[#222] text-[9px] font-bold uppercase tracking-widest hover:border-[#00FF00] transition-colors flex items-center gap-2 group">
                  <Maximize2 size={12} className="group-hover:text-[#00FF00]" /> Fullscreen
                </button>
                <button className="h-8 w-8 flex items-center justify-center bg-[#111] border border-[#222] hover:text-[#00FF00] transition-colors">
                  <Heart size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#050505] relative overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-[20vw] font-black text-white/[0.02] uppercase select-none tracking-tighter skew-x-[-10deg]">
                   {selectedGame.title}
                 </div>
               </div>
              <iframe
                src={selectedGame.url}
                className="w-full h-full border-none relative z-10"
                title={selectedGame.title}
                allowFullScreen
              />
            </div>
            <div className="px-6 py-3 border-t border-[#222] bg-[#0A0A0A] shrink-0">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-[10px] font-mono text-[#444] uppercase tracking-widest italic">
                    Desc_Readout: <span className="text-[#666] normal-case tracking-normal">{selectedGame.description}</span>
                  </div>
                </div>
                <div className="flex items-center gap-8 text-[9px] font-bold uppercase tracking-widest text-[#333]">
                   <div className="flex items-center gap-2">
                     <span className="text-[#00FF00]">FPS</span> 60.0
                   </div>
                   <div className="flex items-center gap-2 underline underline-offset-4 cursor-pointer hover:text-white transition-colors">
                     Submit Feedback
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-[#111] mt-32 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Gamepad2 size={200} />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
                  <Gamepad2 size={20} className="text-black" />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tighter">Nova<span className="text-[#00FF00]">Arcade</span></h1>
              </div>
              <p className="text-xs text-[#555] leading-relaxed max-w-sm font-medium">
                Autonomous gaming terminal delivering low-latency, high-impact entertainment units to distributed systems worldwide. Nova Arcade is built for performance and persistence.
              </p>
              <div className="flex gap-4">
                <div className="h-10 w-10 border border-[#222] flex items-center justify-center text-[#444] hover:text-[#00FF00] hover:border-[#00FF00] transition-colors cursor-pointer">
                  <Search size={16} />
                </div>
                <div className="h-10 w-10 border border-[#222] flex items-center justify-center text-[#444] hover:text-[#00FF00] hover:border-[#00FF00] transition-colors cursor-pointer">
                  <Heart size={16} />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF00]">Directory</h4>
              <nav className="flex flex-col gap-3 text-[11px] font-bold uppercase tracking-widest text-[#444]">
                <a className="hover:text-white transition-colors">Internal_Index</a>
                <a className="hover:text-white transition-colors">System_Updates</a>
                <a className="hover:text-white transition-colors">Contributor_Protocol</a>
                <a className="hover:text-white transition-colors">Secure_Access</a>
              </nav>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF00]">Legal_Docs</h4>
              <nav className="flex flex-col gap-3 text-[11px] font-bold uppercase tracking-widest text-[#444]">
                <a className="hover:text-white transition-colors">Privacy_Schema</a>
                <a className="hover:text-white transition-colors">License_Agreement</a>
                <a className="hover:text-white transition-colors">Cookie_Cache</a>
              </nav>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-[#111] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[10px] font-mono text-[#333] tracking-[0.2em] uppercase">
              © 2026 NOVA_SYSTEMS // PROJECT_ARCADE
            </div>
            <div className="flex gap-6 text-[10px] font-mono text-[#333]">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF00]" /> DC: NORTH_AMERICA</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF00]" /> STATUS: ONLINE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
