import { useState, useEffect } from 'react';
import { Clock, User, Swords } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

// Simple Countdown Component
function MatchCountdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft(null);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <div className="text-primary font-bold text-sm tracking-widest animate-pulse">MATCH STARTING OR COMPLETED</div>;

  return (
    <div className="flex gap-2 text-center text-xs">
      <div className="bg-black/50 border border-gray-800 p-2 w-12"><div className="font-bold text-white text-lg">{timeLeft.d}</div><div className="text-[9px] text-textMuted tracking-widest">DAYS</div></div>
      <div className="bg-black/50 border border-gray-800 p-2 w-12"><div className="font-bold text-white text-lg">{timeLeft.h}</div><div className="text-[9px] text-textMuted tracking-widest">HRS</div></div>
      <div className="bg-black/50 border border-gray-800 p-2 w-12"><div className="font-bold text-white text-lg">{timeLeft.m}</div><div className="text-[9px] text-textMuted tracking-widest">MIN</div></div>
      <div className="bg-black/50 border border-gray-800 p-2 w-12"><div className="font-bold text-white text-lg">{timeLeft.s}</div><div className="text-[9px] text-textMuted tracking-widest">SEC</div></div>
    </div>
  );
}

export default function MyTournaments({ registrations, tournaments }: any) {
  const { profile } = useAuthStore();
  const activeRegs = registrations.filter((r: any) => r.status === 'PENDING_APPROVAL' || r.status === 'CONFIRMED' || r.status === 'APPROVED');

  if (activeRegs.length === 0) {
    return (
      <div className="bg-secondary/50 border border-gray-800 p-12 text-center flex flex-col items-center">
        <Swords size={48} className="text-gray-700 mb-4" />
        <h3 className="font-display text-2xl text-white tracking-widest mb-2">NO UPCOMING MATCHES</h3>
        <p className="text-textMuted">You have not registered for any active tournaments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {activeRegs.map((reg: any) => {
        const tournament = tournaments[reg.tournamentId];
        const tName = tournament ? tournament.name : 'TOURNAMENT';
        const tMode = tournament ? tournament.mode : (reg.mode || 'BATTLE ROYALE');
        const startDate = tournament?.startDate ? tournament.startDate.toDate() : null;

        return (
          <div key={reg.id} className="bg-secondary/80 border border-gray-800 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:border-primary/40 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 font-bold tracking-widest uppercase">{tMode.replace('_', ' ')}</span>
                {reg.type && <span className="text-[10px] bg-white/10 text-white border border-white/10 px-2 py-0.5 font-bold tracking-widest">{reg.type}</span>}
              </div>
              <h4 className="font-display text-3xl text-white mb-2">{tName}</h4>
              <div className="text-sm text-textMuted flex items-center gap-2 font-medium">
                <User size={14} className="text-primary/70" /> 
                {reg.type === 'SQUAD' || reg.teamName ? reg.teamName : (reg.playerName || profile?.username)}
              </div>
              {/* Room details if approved */}
              {(reg.status === 'APPROVED' || reg.status === 'CONFIRMED') && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold tracking-widest flex flex-col md:flex-row gap-4">
                  <div>ROOM ID: <span className="text-white">{tournament?.roomId || 'TBA'}</span></div>
                  <div>PASSWORD: <span className="text-white">{tournament?.roomPassword || 'TBA'}</span></div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-start md:items-end w-full md:w-auto bg-black/40 p-4 md:p-0 md:bg-transparent md:border-none border border-gray-800 gap-3">
              <div className={`text-[10px] font-bold tracking-widest px-3 py-1 border ${
                (reg.status === 'CONFIRMED' || reg.status === 'APPROVED')
                  ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                  : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
              }`}>
                {reg.status === 'PENDING_APPROVAL' ? 'PENDING APPROVAL' : reg.status}
              </div>
              
              {startDate ? (
                <div className="mt-2">
                  <div className="text-[10px] text-textMuted tracking-widest mb-2 flex items-center gap-1 md:justify-end">
                    <Clock size={12} className="text-primary/70" /> TIME TO MATCH
                  </div>
                  <MatchCountdown targetDate={startDate} />
                </div>
              ) : (
                <div className="text-xs text-textMuted italic mt-4">Schedule TBA</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
