import { Link } from 'react-router-dom';
import { Video, Camera, MessageCircle, Monitor } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#030303] relative pt-16 pb-8 border-t border-gray-900">
      {/* Elegant Crimson Divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
              <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(224,0,42,0.5)]">
                <div className="absolute inset-0 bg-primary/10 -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <span className="font-display text-primary font-bold text-xl leading-none relative z-10">OM</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-wider leading-none text-white">
                  ONLY <span className="text-primary">MANSEHRA</span>
                </span>
                <span className="font-display text-sm font-bold tracking-widest text-textMuted mt-1">
                  ESPORTS
                </span>
              </div>
            </Link>
            <p className="text-textMuted text-sm mb-6 leading-relaxed">
              The premier esports platform for competitive players. Build your squad, enter the arena, and fight for the championship.
            </p>
            <p className="font-display text-primary text-sm font-bold tracking-widest">
              COMPETE • CONQUER • BECOME A CHAMPION
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl mb-6 text-white tracking-widest border-b border-gray-800 pb-2 inline-block">QUICK LINKS</h4>
            <ul className="space-y-3 text-sm font-bold tracking-wider text-textMuted">
              <li><Link to="/tournament" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-2 h-px bg-primary/0 group-hover:bg-primary transition-all"></span> Tournaments</Link></li>
              <li><Link to="/schedule" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-2 h-px bg-primary/0 group-hover:bg-primary transition-all"></span> Schedule</Link></li>
              <li><Link to="/leaderboard" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-2 h-px bg-primary/0 group-hover:bg-primary transition-all"></span> Leaderboard</Link></li>
              <li><Link to="/rules" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-2 h-px bg-primary/0 group-hover:bg-primary transition-all"></span> Rules</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-xl mb-6 text-white tracking-widest border-b border-gray-800 pb-2 inline-block">SUPPORT</h4>
            <ul className="space-y-3 text-sm font-bold tracking-wider text-textMuted">
              <li><Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-2 h-px bg-primary/0 group-hover:bg-primary transition-all"></span> Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-2 h-px bg-primary/0 group-hover:bg-primary transition-all"></span> FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-2 h-px bg-primary/0 group-hover:bg-primary transition-all"></span> Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-2 h-px bg-primary/0 group-hover:bg-primary transition-all"></span> Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-display text-xl mb-6 text-white tracking-widest border-b border-gray-800 pb-2 inline-block">COMMUNITY</h4>
            <div className="flex gap-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-900 border border-gray-800 flex items-center justify-center text-textMuted hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(224,0,42,0.5)]">
                <Video size={18} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-900 border border-gray-800 flex items-center justify-center text-textMuted hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(224,0,42,0.5)]">
                <Camera size={18} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-900 border border-gray-800 flex items-center justify-center text-textMuted hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(224,0,42,0.5)]">
                <MessageCircle size={18} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-900 border border-gray-800 flex items-center justify-center text-textMuted hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(224,0,42,0.5)]">
                <Monitor size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col justify-center items-center text-xs text-textMuted font-bold tracking-widest">
          <p>© 2026 Only Mansehra Esports. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
