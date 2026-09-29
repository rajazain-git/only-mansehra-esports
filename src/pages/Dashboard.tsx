import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { getUserRegistrations, getUserTransactions } from '../firebase/user_dashboard';
import { getTournaments } from '../firebase/admin_tournaments';
import type { Tournament } from '../firebase/admin_tournaments';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Sub-components
import Sidebar from '../components/dashboard/Sidebar';
import Overview from '../components/dashboard/Overview';
import MyTournaments from '../components/dashboard/MyTournaments';
import History from '../components/dashboard/History';
import TokenHistory from '../components/dashboard/TokenHistory';
import Notifications from '../components/dashboard/Notifications';
import Settings from '../components/dashboard/Settings';

const Dashboard = () => {
  const { user, profile, loading } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<Record<string, Tournament>>({});
  const [winnerCelebrationReg, setWinnerCelebrationReg] = useState<any | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setDataLoading(true);
        try {
          const [regs, txs, tourns] = await Promise.all([
            getUserRegistrations(user.uid),
            getUserTransactions(user.uid),
            getTournaments()
          ]);
          
          setRegistrations(regs);
          setTransactions(txs);
          
          const unseenWinner = regs.find((r: any) => r.status === 'WINNER' && r.celebrationSeen === false);
          if (unseenWinner) {
            setWinnerCelebrationReg(unseenWinner);
            triggerConfetti();
          }

          const tMap: Record<string, Tournament> = {};
          tourns.forEach(t => tMap[t.id] = t);
          setTournaments(tMap);
        } catch (err) {
          console.error("Dashboard data fetch error", err);
        } finally {
          setDataLoading(false);
        }
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
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const dismissCelebration = async () => {
    if (winnerCelebrationReg) {
      try {
        await updateDoc(doc(db, 'registrations', winnerCelebrationReg.id), { celebrationSeen: true });
      } catch (err) {
        console.error("Failed to dismiss celebration", err);
      }
      setWinnerCelebrationReg(null);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-textMuted font-bold tracking-widest text-sm">LOADING COMMAND CENTER...</p>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    // Basic fallback if they are stuck
    const { logoutUser } = await import('../firebase/auth');
    await logoutUser();
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setProfile(null);
    navigate('/');
  };

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-background text-white p-4 text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">PROFILE NOT FOUND</h2>
        <p className="text-textMuted mb-6 max-w-md">
          Your account exists, but we couldn't find your player profile data. This usually happens if your account was created incompletely. Please log out and register again or contact support.
        </p>
        <button onClick={handleLogout} className="bg-primary text-white font-bold tracking-widest px-8 py-3 skew-x-[-10deg]">
          <div className="skew-x-[10deg]">LOGOUT</div>
        </button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview registrations={registrations} />;
      case 'tournaments':
        return <MyTournaments registrations={registrations} tournaments={tournaments} />;
      case 'history':
        return <History registrations={registrations} tournaments={tournaments} />;
      case 'transactions':
        return <TokenHistory transactions={transactions} />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview registrations={registrations} />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex flex-col md:flex-row relative">
      
      {/* Celebration Modal */}
      <AnimatePresence>
        {winnerCelebrationReg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }}
              className="bg-secondary border-2 border-gold/50 p-8 md:p-12 max-w-2xl w-full relative overflow-hidden text-center shadow-[0_0_100px_rgba(255,209,102,0.2)]"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/20 blur-[100px] rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold/20 blur-[100px] rounded-full" />
              <button onClick={dismissCelebration} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"><X size={24} /></button>
              <div className="relative z-10">
                <Trophy size={80} className="text-gold mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,209,102,0.5)]" />
                <h2 className="font-display text-5xl md:text-7xl font-bold text-gold tracking-wider mb-4 leading-none">CHAMPION!</h2>
                <h3 className="font-display text-2xl md:text-3xl text-white tracking-widest mb-6">
                  {tournaments[winnerCelebrationReg.tournamentId]?.name || 'THE TOURNAMENT'}
                </h3>
                <p className="text-gray-300 text-lg md:text-xl font-medium max-w-lg mx-auto mb-10 leading-relaxed">
                  Congratulations <span className="text-white font-bold">{winnerCelebrationReg.teamName || winnerCelebrationReg.playerName || profile.username}</span>! 
                  You have emerged victorious.
                </p>
                <button onClick={dismissCelebration} className="bg-gold text-background font-display font-bold text-xl px-12 py-4 tracking-widest hover:bg-white transition-colors skew-x-[-10deg]">
                  <span className="skew-x-[10deg] inline-block">CLAIM GLORY</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-80px)]">
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
