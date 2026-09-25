import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LayoutDashboard, Users, Trophy, Settings, LogOut } from 'lucide-react';
import { logoutUser } from '../../firebase/auth';

const ADMIN_LINKS = [
  { name: 'OVERVIEW', path: '/admin', icon: <LayoutDashboard size={18} /> },
  { name: 'USERS & TOKENS', path: '/admin/users', icon: <Users size={18} /> },
  { name: 'TOURNAMENTS', path: '/admin/tournaments', icon: <Trophy size={18} /> },
  { name: 'SETTINGS', path: '/admin/settings', icon: <Settings size={18} /> },
];

const AdminLayout = () => {
  const { user, profile, loading, setUser, setProfile } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/admin/login');
      } else if (profile && profile.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading || !profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030303] text-white">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-textMuted font-bold tracking-widest text-sm">VERIFYING CREDENTIALS...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-[#030303] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rotate-45 flex items-center justify-center">
              <span className="font-display text-white -rotate-45 font-bold text-xl leading-none">FF</span>
            </div>
            <span className="font-display text-2xl font-bold tracking-wider leading-none mt-1">
              ADMIN <span className="text-accent">PANEL</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {ADMIN_LINKS.map(link => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-bold text-sm tracking-widest ${
                location.pathname === link.path 
                  ? 'bg-accent/20 text-accent border border-accent/50' 
                  : 'text-textMuted hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={18} /> EXIT ADMIN
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-secondary p-4 border-b border-gray-800 flex justify-between items-center">
          <span className="font-display text-xl text-accent font-bold">ADMIN PANEL</span>
          <Link to="/" className="text-sm font-bold underline">BACK TO SITE</Link>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-10 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
