import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getTournaments } from '../firebase/admin_tournaments';
import type { Tournament, GameMode } from '../firebase/admin_tournaments';
import { Loader2, Users, Shield, Target, Swords, AlertCircle, Clock, ChevronRight } from 'lucide-react';

const TABS: { id: GameMode; label: string; icon: any; color: string }[] = [
  { id: 'BATTLE_ROYALE', label: 'BATTLE ROYALE', icon: Shield, color: 'from-blue-500/20 to-blue-600/5' },
  { id: 'CLASH_SQUAD', label: 'CLASH SQUAD', icon: Swords, color: 'from-primary/20 to-primary/5' },
  { id: 'LONE_WOLF', label: 'LONE WOLF', icon: Target, color: 'from-purple-500/20 to-purple-600/5' },
];

export default function GameModes() {
  const [activeTab, setActiveTab] = useState<GameMode>('BATTLE_ROYALE');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const data = await getTournaments();
        setTournaments(data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  const filteredTournaments = tournaments.filter(t => t.mode === activeTab);

  return (
    <div className="min-h-screen py-24 px-4 relative bg-[#060608] overflow-hidden">
      
      {/* Simple static background glow for depth without animation lag */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] max-w-[800px] bg-[radial-gradient(ellipse_at_top,_rgba(224,0,42,0.1),_transparent_70%)] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        
        <div className="text-center mb-16 relative">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white tracking-wider mb-4 relative z-10 [text-shadow:0_0_10px_rgba(224,0,42,0.3)]">
            GAME <span className="text-primary">MODES</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light tracking-wide relative z-10">
            Select your battlefield. Whether you fight alone, lead a squad, or face-off in an intense 1v1, your glory awaits.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-6 mb-16 relative z-10">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative group flex items-center gap-3 px-8 py-4 font-display tracking-widest font-bold transition-all duration-300 overflow-hidden skew-x-[-10deg] ${
                  isActive 
                    ? 'text-white' 
                    : 'text-textMuted hover:text-white'
                }`}
              >
                {/* Background layers */}
                <div className={`absolute inset-0 transition-colors duration-300 ${
                  isActive ? 'bg-primary' : 'bg-[#0B0B0F]/95 border border-gray-800 group-hover:border-primary/50 group-hover:bg-primary/10'
                }`} />
                
                {/* Active glow - optimized from blur to simple opacity + bg */}
                {isActive && (
                  <div className="absolute inset-0 bg-white/10 pointer-events-none" />
                )}

                <div className="relative z-10 flex items-center gap-3 skew-x-[10deg]">
                  <Icon size={20} />
                  {tab.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Tournaments List */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full pt-20">
              <Loader2 size={40} className="text-primary animate-spin mb-4" />
              <p className="text-textMuted font-bold tracking-widest">LOADING INTEL...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredTournaments.length === 0 ? (
                  <div className="col-span-full py-20 text-center border border-gray-800 border-dashed bg-secondary/40">
                    <AlertCircle size={50} className="text-gray-500 mx-auto mb-4" />
                    <h3 className="text-white font-display text-2xl tracking-widest mb-2">NO SECRETS UNCOVERED</h3>
                    <p className="text-textMuted text-sm">Check back later for upcoming {activeTab.replace('_', ' ')} tournaments.</p>
                  </div>
                ) : (
                  filteredTournaments.map((tournament) => (
                    <div 
                      key={tournament.id}
                      className="group relative overflow-hidden flex flex-col bg-[#0B0B0F] border border-gray-800 hover:border-primary/50 transition-all duration-200 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

                      {/* Poster Image */}
                      {tournament.posterUrl && (
                        <div className="h-48 w-full relative overflow-hidden border-b border-gray-800">
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] to-transparent z-10" />
                          <img 
                            src={tournament.posterUrl} 
                            alt={tournament.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      <div className="p-8 flex-grow relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="font-display text-3xl font-bold text-white tracking-wider group-hover:text-primary transition-colors">
                            {tournament.name}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-bold tracking-widest uppercase border ${
                            tournament.registrationStatus === 'OPEN' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                              : 'bg-red-500/10 text-red-500 border-red-500/30'
                          }`}>
                            {tournament.registrationStatus}
                          </span>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div className="flex items-center justify-between text-sm pb-2 border-b border-gray-800/50">
                            <span className="text-gray-400 flex items-center gap-2"><Users size={16} className="text-primary"/> Type:</span>
                            <span className="text-white font-bold tracking-widest text-xs">
                              {tournament.mode === 'BATTLE_ROYALE' 
                                ? (tournament.brOptions?.solo && tournament.brOptions?.squad ? 'SOLO / SQUAD' : tournament.brOptions?.squad ? 'SQUAD' : 'SOLO') 
                                : tournament.mode === 'CLASH_SQUAD' ? 'TEAM' : '1v1'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm pb-2 border-b border-gray-800/50">
                            <span className="text-gray-400 flex items-center gap-2"><Target size={16} className="text-primary"/> Entry Fee:</span>
                            <span className="text-primary font-bold tracking-wider">{tournament.entryFee} TOKENS</span>
                          </div>
                          
                          {tournament.maxParticipants && (
                            <div className="flex items-center justify-between text-sm pb-2 border-b border-gray-800/50">
                              <span className="text-gray-400 flex items-center gap-2"><Users size={16} className="text-primary"/> Slots:</span>
                              <span className={`font-bold tracking-wider ${tournament.currentParticipants && tournament.currentParticipants >= tournament.maxParticipants ? 'text-red-500' : 'text-white'}`}>
                                {tournament.currentParticipants || 0} / {tournament.maxParticipants}
                              </span>
                            </div>
                          )}

                          {tournament.startDate && (
                            <div className="flex items-center justify-between text-sm pb-2">
                              <span className="text-gray-400 flex items-center gap-2"><Clock size={16} className="text-primary"/> Start Date:</span>
                              <span className="text-white font-bold tracking-wider">{tournament.startDate.toDate().toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-8 pt-0 mt-auto relative z-10">
                        {tournament.registrationStatus === 'OPEN' ? (
                          <Link 
                            to={`/tournaments/${tournament.id}/register`}
                            className="group/btn relative w-full flex items-center justify-center py-4 bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-white font-bold tracking-widest text-sm transition-colors duration-200"
                          >
                            <span className="flex items-center gap-2">REGISTER NOW <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/></span>
                          </Link>
                        ) : (
                          <button 
                            disabled
                            className="w-full flex items-center justify-center py-4 bg-gray-900/80 text-red-500/80 font-bold tracking-widest text-sm cursor-not-allowed border border-red-900/30 shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]"
                          >
                            SLOTS FULL
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

      </div>
    </div>
  );
}
