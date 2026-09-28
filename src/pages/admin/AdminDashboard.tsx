import { useEffect, useState } from 'react';
import { Users, Trophy, Coins, Activity, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface StatData {
  totalUsers: number;
  totalRegistrations: number;
  totalTokensIssued: number;
  activeTournaments: number;
  pendingApprovals: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<StatData>({
    totalUsers: 0,
    totalRegistrations: 0,
    totalTokensIssued: 0,
    activeTournaments: 0,
    pendingApprovals: 0,
  });
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Aggregations with individual error handling
        const usersColl = collection(db, 'users');
        const regColl = collection(db, 'registrations');
        const txColl = collection(db, 'transactions');
        const tourneyColl = collection(db, 'tournaments');

        let totalUsers = 0;
        let totalRegistrations = 0;
        let totalTokensIssued = 0;
        let activeTournaments = 0;
        let pendingApprovals = 0;

        try {
          const uSnap = await getDocs(usersColl);
          totalUsers = uSnap.size;
        } catch (e) { console.error("Users error", e); }

        try {
          const rSnap = await getDocs(regColl);
          totalRegistrations = rSnap.size;
        } catch (e) { console.error("Reg error", e); }

        try {
          const tSnap = await getDocs(query(tourneyColl, where('registrationStatus', '==', 'OPEN')));
          activeTournaments = tSnap.size;
        } catch (e) { console.error("Tourney error", e); }

        try {
          const pSnap = await getDocs(query(regColl, where('status', '==', 'PENDING_APPROVAL')));
          pendingApprovals = pSnap.size;
        } catch (e) { console.error("Pending error", e); }

        try {
          // Manual sum to avoid missing composite index errors on sum() aggregations
          const txSnap = await getDocs(query(txColl, where('type', '==', 'ADMIN_ADD')));
          txSnap.forEach(doc => {
            const data = doc.data();
            totalTokensIssued += Number(data.amount || 0);
          });
        } catch (e) { console.error("Tx error", e); }

        // 2. Recent Registrations
        const regQ = query(regColl, orderBy('createdAt', 'desc'), limit(5));
        let regDocs: any[] = [];
        try {
          const r = await getDocs(regQ);
          regDocs = r.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { console.error("Recent Reg error", e); }
        
        // 3. Recent Transactions
        const txQ = query(txColl, orderBy('createdAt', 'desc'), limit(5));
        let txDocs: any[] = [];
        try {
          const t = await getDocs(txQ);
          txDocs = t.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { console.error("Recent Tx error", e); }

        setStats({
          totalUsers,
          totalRegistrations,
          totalTokensIssued,
          activeTournaments,
          pendingApprovals,
        });

        setRecentRegistrations(regDocs);
        setRecentTransactions(txDocs);
        
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const STATS_UI = [
    { label: 'TOTAL USERS', value: stats.totalUsers.toLocaleString(), icon: <Users size={24} className="text-blue-500" /> },
    { label: 'REGISTRATIONS', value: stats.totalRegistrations.toLocaleString(), icon: <Trophy size={24} className="text-gold" /> },
    { label: 'PENDING APPROVALS', value: stats.pendingApprovals.toLocaleString(), icon: <Activity size={24} className="text-yellow-500" /> },
    { label: 'TOKENS ISSUED', value: stats.totalTokensIssued.toLocaleString(), icon: <Coins size={24} className="text-accent" /> },
    { label: 'OPEN TOURNAMENTS', value: stats.activeTournaments.toLocaleString(), icon: <Activity size={24} className="text-primary" /> },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl font-bold mb-8 tracking-wider">OVERVIEW</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        {STATS_UI.map((stat, idx) => (
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
            {recentRegistrations.length === 0 ? (
              <p className="text-textMuted p-4 text-center border border-dashed border-gray-800">No registrations yet</p>
            ) : (
              recentRegistrations.map((reg) => (
                <div key={reg.id} className="flex justify-between items-center p-3 bg-black/20 border border-gray-800/50">
                  <div>
                    <p className="font-bold text-white">{reg.teamName || reg.playerName || 'Unknown'}</p>
                    <p className="text-xs text-textMuted">{reg.mode?.replace('_', ' ')} • {reg.type}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 ${
                    reg.status === 'APPROVED' ? 'text-green-500 bg-green-500/10' : 
                    reg.status === 'REJECTED' ? 'text-red-500 bg-red-500/10' :
                    'text-yellow-500 bg-yellow-500/10'
                  }`}>
                    {reg.status || 'PENDING'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Token Transactions */}
        <div className="bg-secondary border border-gray-800 p-6">
          <h2 className="font-display text-2xl mb-6">TOKEN TRANSACTIONS</h2>
          <div className="space-y-4 text-sm">
            {recentTransactions.length === 0 ? (
              <p className="text-textMuted p-4 text-center border border-dashed border-gray-800">No transactions yet</p>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-3 bg-black/20 border border-gray-800/50">
                  <div className="truncate pr-4">
                    <p className="font-bold text-white truncate">User: {tx.userId?.slice(0, 8)}...</p>
                    <p className="text-xs text-textMuted truncate">{tx.reason || tx.type}</p>
                  </div>
                  <span className={`font-display text-xl whitespace-nowrap ${
                    tx.type === 'ADMIN_ADD' || tx.type === 'PURCHASE' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {tx.type === 'ADMIN_ADD' || tx.type === 'PURCHASE' ? '+' : '-'}{tx.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
