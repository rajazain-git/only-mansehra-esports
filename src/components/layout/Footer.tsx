import { Link } from 'react-router-dom';
import { Video, Camera, MessageCircle, Monitor } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <div className="w-8 h-8 bg-primary rotate-45 flex items-center justify-center">
                <span className="font-display text-white -rotate-45 font-bold text-xl leading-none">FF</span>
              </div>
              <span className="font-display text-2xl font-bold tracking-wider leading-none mt-1">
                BATTLE <span className="text-primary">ARENA</span>
              </span>
            </Link>
            <p className="text-textMuted text-sm mb-6">
              The premier esports platform for competitive players. Build your squad, enter the arena, and fight for the championship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl mb-4 text-white">QUICK LINKS</h4>
            <ul className="space-y-2 text-sm text-textMuted">
              <li><Link to="/tournament" className="hover:text-primary transition-colors">Tournaments</Link></li>
              <li><Link to="/schedule" className="hover:text-primary transition-colors">Schedule</Link></li>
              <li><Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
              <li><Link to="/rules" className="hover:text-primary transition-colors">Rules</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-xl mb-4 text-white">SUPPORT</h4>
            <ul className="space-y-2 text-sm text-textMuted">
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-display text-xl mb-4 text-white">COMMUNITY</h4>
            <div className="flex gap-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded hover:bg-primary transition-colors hover:scale-110">
                <Video size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded hover:bg-primary transition-colors hover:scale-110">
                <Camera size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded hover:bg-primary transition-colors hover:scale-110">
                <MessageCircle size={20} /> {/* WhatsApp */}
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded hover:bg-primary transition-colors hover:scale-110">
                <Monitor size={20} /> {/* Discord */}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Free Fire Battle Arena. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Not affiliated with Garena or Free Fire official.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
