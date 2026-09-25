import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { logoutUser } from '../firebase/auth';
import { motion } from 'framer-motion';
import { LogOut, User, Mail, Phone, Wallet, Activity, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, loading, setUser, setProfile } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-textMuted font-bold tracking-widest text-sm">LOADING COMMAND CENTER...</p>
      </div>
    );
  }

  if (!user || !profile) return null;

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-wider">COMMAND <span className="text-primary">CENTER</span></h1>
            <p className="text-textMuted">Welcome back, {profile.fullName}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-white transition-colors border border-red-500/30 hover:bg-red-500/20 px-4 py-2"
          >
            <LogOut size={16} /> LOGOUT
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile & Tokens */}
          <div className="space-y-8">
            
            {/* Token Balance Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary border border-gold/30 p-8 shadow-[0_0_30px_rgba(255,209,102,0.05)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[30px] -mr-10 -mt-10" />
              <h3 className="text-xs font-bold text-gold tracking-widest mb-2 flex items-center gap-2">
                <Wallet size={14} /> TOKEN BALANCE
              </h3>
              <div className="font-display text-6xl text-white mb-6">{profile.tokenBalance}</div>
              
              <button className="w-full py-3 bg-gold/10 border border-gold/50 text-gold font-bold tracking-widest text-sm hover:bg-gold hover:text-background transition-colors flex items-center justify-center gap-2">
                <CreditCard size={16} /> BUY TOKENS
              </button>
            </motion.div>

            {/* Profile Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary border border-gray-800 p-8"
            >
              <h3 className="font-display text-2xl text-white mb-6 border-b border-gray-800 pb-2">PROFILE INFO</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-textMuted mt-1" />
                  <div>
                    <div className="text-xs text-textMuted tracking-widest">USERNAME</div>
                    <div className="font-bold text-white">{profile.username}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-textMuted mt-1" />
                  <div>
                    <div className="text-xs text-textMuted tracking-widest">EMAIL</div>
                    <div className="font-bold text-white">{profile.email}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-textMuted mt-1" />
                  <div>
                    <div className="text-xs text-textMuted tracking-widest">WHATSAPP</div>
                    <div className="font-bold text-white">{profile.phone}</div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column - Activity & Tournaments */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Active Tournaments */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary border border-gray-800 p-8"
            >
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-2">
                <h3 className="font-display text-2xl text-white">MY TOURNAMENTS</h3>
                <span className="text-xs text-textMuted bg-gray-800 px-2 py-1">0 ACTIVE</span>
              </div>
              
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-700 bg-black/20">
                <Activity size={40} className="text-gray-600 mb-4" />
                <p className="text-textMuted mb-4">You haven't registered for any tournaments yet.</p>
                <button className="px-6 py-2 bg-primary/20 text-primary border border-primary text-sm font-bold tracking-widest hover:bg-primary hover:text-white transition-colors">
                  BROWSE TOURNAMENTS
                </button>
              </div>
            </motion.div>

            {/* Transaction History Placeholder */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-secondary border border-gray-800 p-8"
            >
              <h3 className="font-display text-2xl text-white mb-6 border-b border-gray-800 pb-2">RECENT TRANSACTIONS</h3>
              
              <div className="space-y-3">
                <div className="text-sm text-textMuted text-center py-6 italic">
                  No recent transactions found.
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
