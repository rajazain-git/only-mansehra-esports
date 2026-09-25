import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import clsx from 'clsx';

const NAV_LINKS = [
  { name: 'HOME', path: '/' },
  { name: 'TOURNAMENT', path: '/tournament' },
  { name: 'SCHEDULE', path: '/schedule' },
  { name: 'LEADERBOARD', path: '/leaderboard' },
  { name: 'RULES', path: '/rules' },
  { name: 'PRIZES', path: '/prizes' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        scrolled ? 'py-3 bg-background/80 backdrop-blur-md border-b border-primary/20' : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rotate-45 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="font-display text-white -rotate-45 font-bold text-xl md:text-2xl leading-none">FF</span>
          </div>
          <span className="font-display text-xl md:text-3xl font-bold tracking-wider leading-none mt-1">
            BATTLE <span className="text-primary">ARENA</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={clsx(
                'text-sm font-semibold tracking-widest hover:text-primary transition-colors',
                location.pathname === link.path ? 'text-primary' : 'text-textMain'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth / Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              {profile?.role === 'admin' && (
                <Link to="/admin" className="text-sm font-bold text-accent hover:text-white transition-colors">
                  ADMIN PANEL
                </Link>
              )}
              <Link to="/dashboard" className="text-sm font-bold hover:text-primary transition-colors">
                DASHBOARD
              </Link>
              <div className="w-px h-6 bg-gray-700"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-textMuted">BALANCE</span>
                <span className="font-display text-xl text-gold">{profile?.tokenBalance || 0}</span>
              </div>
              <button 
                onClick={async () => {
                  const { logoutUser } = await import('../../firebase/auth');
                  await logoutUser();
                }}
                className="text-xs font-bold text-red-500 hover:text-white transition-colors ml-4 border border-red-500/30 px-3 py-1 hover:bg-red-500/20"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold hover:text-primary transition-colors">
                LOGIN
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-primary text-white font-bold text-sm skew-x-[-15deg] hover:bg-primary/80 transition-colors shadow-[0_0_15px_rgba(224,0,42,0.4)]"
              >
                <div className="skew-x-[15deg]">REGISTER NOW</div>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white hover:text-primary transition-colors"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-secondary/95 backdrop-blur-xl border-b border-primary/20 shadow-2xl lg:hidden flex flex-col p-6 gap-4"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  'text-lg font-display tracking-widest',
                  location.pathname === link.path ? 'text-primary' : 'text-textMain'
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-gray-800 my-2"></div>
            {user ? (
              <>
                <Link to="/dashboard" className="text-lg font-display tracking-widest text-white">DASHBOARD</Link>
                {profile?.role === 'admin' && (
                  <Link to="/admin" className="text-lg font-display tracking-widest text-accent">ADMIN PANEL</Link>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-textMuted">BALANCE:</span>
                  <span className="font-display text-2xl text-gold">{profile?.tokenBalance || 0}</span>
                </div>
                <button 
                  onClick={async () => {
                    const { logoutUser } = await import('../../firebase/auth');
                    await logoutUser();
                    closeMobileMenu();
                  }}
                  className="text-left py-3 mt-4 text-red-500 font-bold border-t border-gray-800"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 mt-2">
                <Link to="/login" className="text-center py-3 border border-gray-700 font-bold hover:bg-gray-800">
                  LOGIN
                </Link>
                <Link to="/register" className="text-center py-3 bg-primary font-bold shadow-lg">
                  REGISTER NOW
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
