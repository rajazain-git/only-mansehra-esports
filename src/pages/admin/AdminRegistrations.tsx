import { useState, useEffect } from 'react';
import { Check, X, Loader2, Search, Copy, CheckCircle2 } from 'lucide-react';
import { getRegistrations, approveRegistration, rejectRegistration } from '../../firebase/admin_registrations';

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const data = await getRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (uid: string) => {
    if (!uid || uid === 'N/A') return;
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm("Are you sure you want to approve this registration?")) return;
    setProcessingId(id);
    try {
      await approveRegistration(id);
      await fetchRegistrations();
    } catch (err) {
      console.error(err);
      alert("Failed to approve registration");
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Are you sure you want to reject this registration? The tokens will be refunded automatically.")) return;
    setProcessingId(id);
    try {
      await rejectRegistration(id);
      await fetchRegistrations();
    } catch (err) {
      console.error(err);
      alert("Failed to reject registration");
    }
    setProcessingId(null);
  };

  const filteredRegistrations = registrations.filter(reg => 
    (reg.teamName || reg.playerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reg.gameUid || reg.captainUid || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reg.whatsapp || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-wider mb-2">REGISTRATIONS</h1>
          <p className="text-textMuted font-bold tracking-widest text-sm">MANAGE PENDING TOURNAMENT REQUESTS</p>
        </div>
      </div>

      <div className="bg-secondary border border-gray-800 p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text"
            placeholder="Search by Team, Name, Game UID, or WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-gray-800 py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="bg-secondary border border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 bg-black/20">
                <th className="p-4 text-xs font-bold text-textMuted tracking-widest">DATE</th>
                <th className="p-4 text-xs font-bold text-textMuted tracking-widest">PLAYER/TEAM</th>
                <th className="p-4 text-xs font-bold text-textMuted tracking-widest">GAME UID</th>
                <th className="p-4 text-xs font-bold text-textMuted tracking-widest">WHATSAPP</th>
                <th className="p-4 text-xs font-bold text-textMuted tracking-widest">MODE</th>
                <th className="p-4 text-xs font-bold text-textMuted tracking-widest">STATUS</th>
                <th className="p-4 text-xs font-bold text-textMuted tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-textMuted font-bold tracking-widest">
                    NO REGISTRATIONS FOUND
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => {
                  const uid = reg.gameUid || reg.captainUid || 'N/A';
                  return (
                    <tr key={reg.id} className="hover:bg-black/20 transition-colors">
                      <td className="p-4 text-sm text-gray-400">
                        {reg.createdAt ? new Date(reg.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-white">{reg.teamName || reg.playerName || 'Unknown'}</p>
                        {reg.type && <span className="text-[10px] bg-gray-800 px-2 py-0.5 mt-1 inline-block">{reg.type}</span>}
                      </td>
                      <td className="p-4 text-sm font-mono flex items-center gap-2 group mt-2">
                        <span className="text-gray-300">{uid}</span>
                        {uid !== 'N/A' && (
                          <button
                            onClick={() => handleCopy(uid)}
                            className="text-gray-500 hover:text-white transition-colors"
                            title="Copy UID"
                          >
                            {copiedUid === uid ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {reg.whatsapp || 'N/A'}
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {reg.mode?.replace('_', ' ') || 'Unknown'}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 font-bold ${
                          reg.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' :
                          reg.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                          'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {reg.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {reg.status === 'PENDING_APPROVAL' && (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleApprove(reg.id)}
                              disabled={processingId === reg.id}
                              className="w-8 h-8 bg-green-500/10 hover:bg-green-500 hover:text-white text-green-500 flex items-center justify-center transition-colors disabled:opacity-50 border border-green-500/20 hover:border-green-500"
                              title="Approve"
                            >
                              {processingId === reg.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            </button>
                            <button 
                              onClick={() => handleReject(reg.id)}
                              disabled={processingId === reg.id}
                              className="w-8 h-8 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center transition-colors disabled:opacity-50 border border-red-500/20 hover:border-red-500"
                              title="Reject & Refund"
                            >
                              {processingId === reg.id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
