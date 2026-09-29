import { LayoutDashboard, Swords, History, Wallet, Bell, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { logoutUser } from '../../firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { profile, setUser, setProfile } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
    navigate('/');
  };

  const navItems = [
    { id: 'overview', label: 'OVERVIEW', icon: <LayoutDashboard size={18} /> },
    { id: 'tournaments', label: 'MY TOURNAMENTS', icon: <Swords size={18} /> },
    { id: 'history', label: 'REG. HISTORY', icon: <History size={18} /> },
    { id: 'transactions', label: 'TOKEN HISTORY', icon: <Wallet size={18} /> },
    { id: 'notifications', label: 'NOTIFICATIONS', icon: <Bell size={18} /> },
    { id: 'settings', label: 'SETTINGS', icon: <Settings size={18} /> },
  ];

  return (
    <div className="w-full md:w-64 bg-secondary/80 border-r border-gray-800 flex flex-col md:h-[calc(100vh-80px)] md:sticky top-20">
      <div className="p-6 border-b border-gray-800">
        <h2 className="font-display text-2xl font-bold text-white tracking-wider">COMMAND CENTER</h2>
        <p className="text-textMuted text-xs">{profile?.username}</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest transition-all ${
                activeTab === item.id
                  ? 'bg-primary/10 text-primary border-r-2 border-primary'
                  : 'text-textMuted hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800 space-y-2">
        {profile?.role === 'admin' && (
          <Link
            to="/admin"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest text-gold hover:bg-gold/10 transition-colors"
          >
            <ShieldAlert size={18} />
            ADMIN PANEL
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          LOGOUT
        </button>
      </div>
    </div>
  );
}
