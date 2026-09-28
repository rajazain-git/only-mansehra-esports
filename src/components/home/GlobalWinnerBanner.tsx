import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalWinnerBanner() {
  const [recentWinners, setRecentWinners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);

        const q = query(
          collection(db, 'registrations'),
          where('status', '==', 'WINNER')
        );
        const snap = await getDocs(q);
        
        // Filter locally to avoid requiring composite index
        const winners = snap.docs
          .map(doc => doc.data())
          .filter(data => data.wonAt && data.wonAt.toDate() >= yesterday);
          
        setRecentWinners(winners);
      } catch (err) {
        console.error("Failed to fetch global winners", err);
      }
    };
    fetchWinners();
  }, []);

  useEffect(() => {
    if (recentWinners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % recentWinners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [recentWinners]);

  if (recentWinners.length === 0) return null;

  const winner = recentWinners[currentIndex];

  return (
    <div className="fixed top-24 left-0 right-0 z-40 pointer-events-none flex justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-black/80 backdrop-blur-md border border-gold/50 px-6 py-3 flex items-center gap-4 shadow-[0_0_30px_rgba(255,209,102,0.2)]"
        >
          <div className="bg-gold/20 p-2 rounded-full animate-pulse">
            <Trophy className="text-gold" size={16} />
          </div>
          <div className="flex flex-col">
            <p className="text-white text-xs md:text-sm font-bold tracking-wider">
              <span className="text-gold uppercase font-display text-lg mr-2">{winner.teamName || winner.playerName}</span> 
              WON THE TOURNAMENT
            </p>
          </div>
          <div className="text-[10px] bg-primary/20 text-primary px-3 py-1 font-bold tracking-widest border border-primary/20">
            {winner.mode?.replace('_', ' ') || 'CHAMPION'}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
