import { Wallet, Swords, Trophy, Activity, CreditCard, Mail, Phone, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import BuyTokensModal from './BuyTokensModal';
import { useState } from 'react';

export default function Overview({ registrations }: any) {
  const { profile } = useAuthStore();
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const activeCount = registrations.filter((r: any) => r.status === 'PENDING_APPROVAL' || r.status === 'CONFIRMED' || r.status === 'APPROVED').length;
  const completedCount = registrations.filter((r: any) => r.status === 'COMPLETED' || r.status === 'WINNER').length;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-secondary/50 border border-gold/30 p-6 shadow-[0_0_15px_rgba(255,209,102,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 blur-[20px] rounded-full" />
          <div className="flex items-center gap-2 text-gold text-xs font-bold tracking-widest mb-4">
            <Wallet size={16} /> AVAILABLE TOKENS
          </div>
          <div className="font-display text-5xl text-white mb-4">{profile?.tokenBalance}</div>
          <button 
            onClick={() => setIsBuyModalOpen(true)}
            className="w-full py-2 bg-gold/10 text-gold text-xs font-bold tracking-widest border border-gold/50 hover:bg-gold hover:text-black transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard size={14} /> GET MORE
          </button>
        </div>

        <div className="bg-secondary/50 border border-gray-800 p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 text-textMuted text-xs font-bold tracking-widest mb-4">
            <Activity size={16} /> TOTAL REGISTRATIONS
          </div>
          <div className="font-display text-5xl text-white">{registrations.length}</div>
        </div>

        <div className="bg-secondary/50 border border-primary/30 p-6 relative overflow-hidden shadow-[0_0_15px_rgba(224,0,42,0.05)]">
          <div className="flex items-center gap-2 text-primary text-xs font-bold tracking-widest mb-4">
            <Swords size={16} /> UPCOMING MATCHES
          </div>
          <div className="font-display text-5xl text-white">{activeCount}</div>
        </div>

        <div className="bg-secondary/50 border border-green-500/30 p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 text-green-500 text-xs font-bold tracking-widest mb-4">
            <Trophy size={16} /> COMPLETED MATCHES
          </div>
          <div className="font-display text-5xl text-white">{completedCount}</div>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="bg-secondary/50 border border-gray-800 p-6">
        <h3 className="font-display text-2xl text-white mb-6 border-b border-gray-800 pb-2">PLAYER IDENTITY</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-textMuted font-bold tracking-widest mb-1 flex items-center gap-2"><User size={14}/> USERNAME</span>
            <span className="text-white font-medium">{profile?.username}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-textMuted font-bold tracking-widest mb-1 flex items-center gap-2"><Mail size={14}/> EMAIL</span>
            <span className="text-white font-medium">{profile?.email}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-textMuted font-bold tracking-widest mb-1 flex items-center gap-2"><Phone size={14}/> WHATSAPP</span>
            <span className="text-white font-medium">{profile?.phone}</span>
          </div>
        </div>
      </div>

      <BuyTokensModal isOpen={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)} />
    </div>
  );
}
