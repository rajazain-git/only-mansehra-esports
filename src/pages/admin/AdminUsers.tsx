import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, increment, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Search, Plus, Minus, UserCheck } from 'lucide-react';

interface UserData {
  uid: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  tokenBalance: number;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [tokenAmount, setTokenAmount] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData: UserData[] = [];
      usersSnap.forEach(doc => {
        usersData.push(doc.data() as UserData);
      });
      setUsers(usersData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustTokens = async (type: 'ADD' | 'REMOVE') => {
    if (!selectedUser) return;
    if (!tokenAmount) {
      alert("Please enter a token amount.");
      return;
    }
    if (!reason) {
      alert("Please enter a reason for this transaction.");
      return;
    }
    
    const amount = parseInt(tokenAmount);
    if (isNaN(amount) || amount <= 0) return;

    const actualAmount = type === 'ADD' ? amount : -amount;
    
    // Prevent negative balance
    if (type === 'REMOVE' && selectedUser.tokenBalance + actualAmount < 0) {
      alert("Cannot reduce balance below 0");
      return;
    }

    try {
      // 1. Update User Balance
      const userRef = doc(db, 'users', selectedUser.uid);
      await updateDoc(userRef, {
        tokenBalance: increment(actualAmount)
      });

      // 2. Create Transaction Record
      await addDoc(collection(db, 'transactions'), {
        userId: selectedUser.uid,
        type: type === 'ADD' ? 'ADMIN_ADD' : 'ADMIN_REMOVE',
        amount: Math.abs(actualAmount),
        balanceBefore: selectedUser.tokenBalance,
        balanceAfter: selectedUser.tokenBalance + actualAmount,
        reason: reason,
        createdAt: serverTimestamp(),
      });

      alert(`Successfully ${type === 'ADD' ? 'added' : 'removed'} ${amount} tokens.`);
      setSelectedUser(null);
      setTokenAmount('');
      setReason('');
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error adjusting tokens", error);
      alert("Failed to adjust tokens");
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="font-display text-4xl font-bold mb-8 tracking-wider">USERS & TOKENS</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Users List */}
        <div className="lg:col-span-2 bg-secondary border border-gray-800 p-6">
          <div className="flex items-center bg-background border border-gray-700 px-4 mb-6">
            <Search size={18} className="text-textMuted" />
            <input 
              type="text" 
              placeholder="Search by username or email..." 
              className="w-full bg-transparent px-4 py-3 text-white focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs font-bold tracking-widest text-textMuted border-b border-gray-800">
                <tr>
                  <th className="pb-3">USER</th>
                  <th className="pb-3">EMAIL</th>
                  <th className="pb-3 text-right">TOKENS</th>
                  <th className="pb-3 text-center">ROLE</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-textMuted">Loading users...</td></tr>
                ) : filteredUsers.map(u => (
                  <tr key={u.uid} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-bold text-white">{u.username}</td>
                    <td className="py-4 text-sm text-textMuted">{u.email}</td>
                    <td className="py-4 text-right font-display text-2xl text-gold">{u.tokenBalance}</td>
                    <td className="py-4 text-center">
                      <span className={`text-[10px] px-2 py-1 font-bold ${u.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-gray-800 text-gray-400'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => setSelectedUser(u)}
                        className="text-xs font-bold text-primary hover:text-white px-3 py-1 border border-primary/50 hover:bg-primary transition-colors"
                      >
                        MANAGE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manage User Panel */}
        <div>
          {selectedUser ? (
            <div className="bg-secondary border border-gray-800 p-6 sticky top-6">
              <div className="flex justify-between items-start mb-6 border-b border-gray-800 pb-4">
                <div>
                  <h3 className="font-display text-2xl text-white">{selectedUser.username}</h3>
                  <p className="text-xs text-textMuted">{selectedUser.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-textMuted font-bold tracking-widest">BALANCE</p>
                  <p className="font-display text-3xl text-gold">{selectedUser.tokenBalance}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">AMOUNT (TOKENS)</label>
                  <input 
                    type="number" 
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    className="w-full bg-background border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. 500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">REASON</label>
                  <input 
                    type="text" 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-background border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. Tournament Reward"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button 
                    onClick={() => handleAdjustTokens('ADD')}
                    className="flex items-center justify-center gap-2 py-3 bg-green-500/20 text-green-500 border border-green-500/50 hover:bg-green-500 hover:text-white transition-colors text-sm font-bold"
                  >
                    <Plus size={16} /> ADD
                  </button>
                  <button 
                    onClick={() => handleAdjustTokens('REMOVE')}
                    className="flex items-center justify-center gap-2 py-3 bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-colors text-sm font-bold"
                  >
                    <Minus size={16} /> REMOVE
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-secondary border border-gray-800 p-12 flex flex-col items-center justify-center text-center h-64 sticky top-6">
              <UserCheck size={40} className="text-gray-700 mb-4" />
              <p className="text-textMuted text-sm">Select a user from the list to manage their tokens.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
