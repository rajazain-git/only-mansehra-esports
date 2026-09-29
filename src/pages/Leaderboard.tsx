import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStandings, type Standing } from '../firebase/standings';
import { Trophy, Medal, Swords, Target, Crosshair } from 'lucide-react';

export default function Leaderboard() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<string>('BATTLE_ROYALE');

  useEffect(() => {
    fetchStandings();
  }, [filterMode]);

  const fetchStandings = async () => {
    setLoading(true);
    const data = await getStandings(filterMode);
    setStandings(data);
    setLoading(false);
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-yellow-500/10 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]';
    if (index === 1) return 'bg-gray-300/10 border-gray-300 text-gray-300';
    if (index === 2) return 'bg-orange-600/10 border-orange-600 text-orange-600';
    return 'bg-secondary/50 border-gray-800 text-textMuted';
  };

  return (
    <div className="min-h-screen py-24 px-4 bg-background">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-7xl font-bold text-white tracking-wider mb-4"
          >
            GLOBAL <span className="text-primary">LEADERBOARD</span>
          </motion.h1>
          <p className="text-textMuted max-w-2xl mx-auto">Official rankings based on verified tournament results.</p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {['BATTLE_ROYALE', 'CLASH_SQUAD', 'LONE_WOLF'].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-8 py-3 font-bold tracking-widest text-sm transition-all skew-x-[-10deg] border ${
                filterMode === mode 
                  ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(224,0,42,0.4)]' 
                  : 'bg-black/50 text-textMuted border-gray-800 hover:text-white hover:border-gray-600'
              }`}
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                {mode === 'BATTLE_ROYALE' && <Target size={16} />}
                {mode === 'CLASH_SQUAD' && <Swords size={16} />}
                {mode === 'LONE_WOLF' && <Crosshair size={16} />}
                {mode.replace('_', ' ')}
              </div>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : standings.length === 0 ? (
          <div className="text-center py-20 bg-secondary/50 border border-gray-800">
            <Trophy size={48} className="mx-auto text-gray-700 mb-4" />
            <h3 className="font-display text-2xl text-white tracking-widest mb-2">NO RANKINGS YET</h3>
            <p className="text-textMuted">Matches for this game mode haven't concluded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-800 text-xs font-bold text-textMuted tracking-widest text-center">
              <div className="col-span-2 md:col-span-1">RANK</div>
              <div className="col-span-6 md:col-span-5 text-left">PLAYER / TEAM</div>
              <div className="col-span-2 hidden md:block">MATCHES</div>
              <div className="col-span-2">WINS</div>
              <div className="col-span-2">POINTS</div>
            </div>

            {/* Rows */}
            {standings.map((s, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={s.id} 
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border ${getRankStyle(idx)} hover:bg-white/5 transition-colors`}
              >
                <div className="col-span-2 md:col-span-1 font-display text-2xl font-bold flex justify-center items-center">
                  {idx === 0 ? <Trophy size={24} className="text-yellow-500 drop-shadow-md" /> :
                   idx === 1 ? <Medal size={24} className="text-gray-300 drop-shadow-md" /> :
                   idx === 2 ? <Medal size={24} className="text-orange-600 drop-shadow-md" /> : 
                   `#${idx + 1}`}
                </div>
                
                <div className="col-span-6 md:col-span-5 text-left font-bold text-white text-lg truncate">
                  {s.name}
                </div>
                
                <div className="col-span-2 hidden md:flex justify-center font-medium">
                  {s.matchesPlayed}
                </div>
                
                <div className="col-span-2 flex justify-center font-bold text-green-500">
                  {s.wins}
                </div>
                
                <div className="col-span-2 flex justify-center font-display text-2xl text-white">
                  {s.points}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
