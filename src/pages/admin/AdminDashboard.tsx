import { Users, Trophy, Coins, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const STATS = [
  { label: 'TOTAL USERS', value: '1,248', icon: <Users size={24} className="text-blue-500" /> },
  { label: 'ACTIVE TEAMS', value: '48', icon: <Trophy size={24} className="text-gold" /> },
  { label: 'TOKENS ISSUED', value: '250,000', icon: <Coins size={24} className="text-accent" /> },
  { label: 'LIVE MATCHES', value: '1', icon: <Activity size={24} className="text-primary" /> },
];

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="font-display text-4xl font-bold mb-8 tracking-wider">OVERVIEW</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {STATS.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-secondary border border-gray-800 p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-textMuted font-bold tracking-widest mb-1">{stat.label}</p>
              <p className="font-display text-4xl text-white">{stat.value}</p>
            </div>
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center">
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Registrations */}
        <div className="bg-secondary border border-gray-800 p-6">
          <h2 className="font-display text-2xl mb-6">RECENT REGISTRATIONS</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center p-3 bg-black/20 border border-gray-800/50">
              <div>
                <p className="font-bold text-white">TITAN ESPORTS</p>
                <p className="text-xs text-textMuted">Season 1 Championship</p>
              </div>
              <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1">PENDING</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/20 border border-gray-800/50">
              <div>
                <p className="font-bold text-white">NINJA SQUAD</p>
                <p className="text-xs text-textMuted">Season 1 Championship</p>
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1">APPROVED</span>
            </div>
          </div>
        </div>

        {/* Recent Token Transactions */}
        <div className="bg-secondary border border-gray-800 p-6">
          <h2 className="font-display text-2xl mb-6">TOKEN TRANSACTIONS</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center p-3 bg-black/20 border border-gray-800/50">
              <div>
                <p className="font-bold text-white">RajaZain</p>
                <p className="text-xs text-textMuted">Admin Added Tokens</p>
              </div>
              <span className="font-display text-xl text-green-500">+500</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/20 border border-gray-800/50">
              <div>
                <p className="font-bold text-white">ProPlayer99</p>
                <p className="text-xs text-textMuted">Tournament Entry Fee</p>
              </div>
              <span className="font-display text-xl text-red-500">-50</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
