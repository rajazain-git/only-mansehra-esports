import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { logoutUser } from '../firebase/auth';
import { getUserRegistrations } from '../firebase/user_dashboard';
import { getTournaments } from '../firebase/admin_tournaments';
import type { Tournament } from '../firebase/admin_tournaments';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Mail, Phone, Wallet, Activity, CreditCard, Clock, Trophy, X } from 'lucide-react';
import BuyTokensModal from '../components/dashboard/BuyTokensModal';
import confetti from 'canvas-confetti';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Dashboard = () => {
  const { user, profile, loading, setUser, setProfile } = useAuthStore();
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<Record<string, Tournament>>({});
  const [winnerCelebrationReg, setWinnerCelebrationReg] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const regs = await getUserRegistrations(user.uid);
        setRegistrations(regs);
        
        // Check for unseen winner celebrations
        const unseenWinner = regs.find((r: any) => r.status === 'WINNER' && r.celebrationSeen === false);
        if (unseenWinner) {
          setWinnerCelebrationReg(unseenWinner);
          triggerConfetti();
        }

        // Fetch all tournaments to map IDs to Names and Schedules
        const tourns = await getTournaments();
        const tMap: Record<string, Tournament> = {};
        tourns.forEach(t => tMap[t.id] = t);
        setTournaments(tMap);
      }
    };
    fetchData();
  }, [user]);

  const triggerConfetti = () => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const dismissCelebration = async () => {
    if (winnerCelebrationReg) {
      try {
        await updateDoc(doc(db, 'registrations', winnerCelebrationReg.id), {
          celebrationSeen: true
        });
      } catch (err) {
        console.error("Failed to dismiss celebration", err);
      }
      setWinnerCelebrationReg(null);
    }
  };

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
      <AnimatePresence>
        {winnerCelebrationReg && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-secondary border-2 border-gold/50 p-8 md:p-12 max-w-2xl w-full relative overflow-hidden text-center shadow-[0_0_100px_rgba(255,209,102,0.2)]"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/20 blur-[100px] rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold/20 blur-[100px] rounded-full" />
              
              <button 
                onClick={dismissCelebration}
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
              >
                <X size={24} />
              </button>

              <div className="relative z-10">
                <Trophy size={80} className="text-gold mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,209,102,0.5)]" />
                <h2 className="font-display text-5xl md:text-7xl font-bold text-gold tracking-wider mb-4 leading-none">
                  CHAMPION!
                </h2>
                <h3 className="font-display text-2xl md:text-3xl text-white tracking-widest mb-6">
                  {tournaments[winnerCelebrationReg.tournamentId]?.name || 'THE TOURNAMENT'}
                </h3>
                <p className="text-gray-300 text-lg md:text-xl font-medium max-w-lg mx-auto mb-10 leading-relaxed">
                  Congratulations <span className="text-white font-bold">{winnerCelebrationReg.teamName || winnerCelebrationReg.playerName || profile.username}</span>! 
                  You have emerged victorious. The admins have officially marked you as the tournament winner!
                </p>
                <button 
                  onClick={dismissCelebration}
                  className="bg-gold text-background font-display font-bold text-xl px-12 py-4 tracking-widest hover:bg-white transition-colors skew-x-[-10deg]"
                >
                  <span className="skew-x-[10deg] inline-block">CLAIM GLORY</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-6xl relative z-10">
        
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
              
              <button 
                onClick={() => setIsBuyModalOpen(true)}
                className="w-full py-3 bg-gold/10 border border-gold/50 text-gold font-bold tracking-widest text-sm hover:bg-gold hover:text-background transition-colors flex items-center justify-center gap-2"
              >
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
              className="bg-[#0B0B0F]/95 border border-gray-800 p-8 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[30px] rounded-full pointer-events-none -mt-20 -mr-20" />
              
              <div className="flex justify-between items-center mb-8 border-b border-gray-800/50 pb-4 relative z-10">
                <h3 className="font-display text-3xl text-white tracking-wider">MY TOURNAMENTS</h3>
                <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 shadow-[0_0_10px_rgba(224,0,42,0.1)]">
                  {registrations.length} ACTIVE
                </span>
              </div>
              
              {registrations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-700 bg-black/20 relative z-10">
                  <Activity size={40} className="text-gray-600 mb-4" />
                  <p className="text-textMuted mb-6 font-medium">You haven't registered for any tournaments yet.</p>
                  <Link to="/modes" className="group relative px-8 py-3 bg-primary/10 text-primary border border-primary/50 text-sm font-bold tracking-widest hover:bg-primary hover:text-white transition-all overflow-hidden skew-x-[-10deg]">
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out skew-x-[10deg]" />
                    <span className="skew-x-[10deg] inline-block">BROWSE TOURNAMENTS</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 relative z-10">
                  {registrations.map((reg, index) => {
                    const tournament = tournaments[reg.tournamentId];
                    const tName = tournament ? tournament.name : (reg.tournamentId.includes('solo') ? 'SOLO CHAMPIONSHIP' : 'SEASON 1 CHAMPIONSHIP');
                    const tMode = tournament ? tournament.mode : (reg.mode || 'BATTLE ROYALE');
                    const startDate = tournament?.startDate ? tournament.startDate.toDate().toLocaleString() : 'TBA';
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (index * 0.1) }}
                        key={reg.id} 
                        className="group relative bg-[#0B0B0F]/80 border border-gray-800/80 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:border-primary/40 transition-all duration-300"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 font-bold tracking-widest uppercase">{tMode.replace('_', ' ')}</span>
                            {reg.type && <span className="text-[10px] bg-white/10 text-white border border-white/10 px-2 py-0.5 font-bold tracking-widest">{reg.type}</span>}
                          </div>
                          <h4 className="font-display text-2xl text-white mb-2 group-hover:text-primary transition-colors">{tName}</h4>
                          <div className="text-sm text-textMuted flex items-center gap-2 font-medium">
                            <User size={14} className="text-primary/70" /> 
                            {reg.type === 'SQUAD' || reg.teamName ? reg.teamName : (reg.playerName || profile.username)}
                          </div>
                        </div>
                        <div className="text-left md:text-right w-full md:w-auto bg-black/40 p-4 md:p-0 md:bg-transparent md:border-none border border-gray-800">
                          <div className="text-[10px] text-textMuted tracking-widest mb-1 flex items-center gap-1 md:justify-end">
                            <Clock size={12} className="text-primary/70" /> SCHEDULED
                          </div>
                          <div className="font-bold text-white text-sm tracking-wide mb-3">{startDate}</div>
                          <div className={`text-[10px] font-bold tracking-widest inline-flex px-3 py-1 border ${
                            reg.status === 'CONFIRMED' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                              : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                          }`}>
                            {reg.status === 'PENDING_APPROVAL' ? 'PENDING APPROVAL' : reg.status}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
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
      
      <BuyTokensModal 
        isOpen={isBuyModalOpen} 
        onClose={() => setIsBuyModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
