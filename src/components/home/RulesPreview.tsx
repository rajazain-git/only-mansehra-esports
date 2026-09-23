import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const RULES = [
  {
    category: 'GENERAL RULES',
    content: 'All players must be at least 16 years of age. Respectful behavior is mandatory. Any form of toxicity, racism, or harassment will result in immediate disqualification.',
  },
  {
    category: 'GAMEPLAY & FAIR PLAY',
    content: 'Use of third-party software, macros, or cheats is strictly prohibited. Emulators are NOT allowed. All matches will be monitored by admins.',
  },
  {
    category: 'SCORING SYSTEM',
    content: '1 Kill = 1 Point. Placement points: Booyah (12 pts), 2nd (9 pts), 3rd (8 pts), 4th (7 pts), etc. Ties are resolved by total kills, then highest placement in the last match.',
  },
  {
    category: 'CONNECTION ISSUES',
    content: 'Players are responsible for their own internet connection. Matches will not be restarted for individual disconnects. If a server crashes, the match will be remade.',
  },
];

const RulesPreview = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-background border-t border-gray-800">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">TOURNAMENT <span className="text-primary">RULES</span></h2>
          <p className="text-textMuted max-w-2xl mx-auto">
            Fair play is our top priority. Please read the rules carefully before registering.
          </p>
        </div>

        <div className="space-y-4">
          {RULES.map((rule, idx) => (
            <div key={idx} className="border border-gray-800 bg-secondary overflow-hidden">
              <button
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-display text-xl tracking-wider text-white">{rule.category}</span>
                <ChevronDown 
                  className={`text-primary transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} 
                  size={20} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-textMuted text-sm leading-relaxed border-t border-gray-800/50 pt-4">
                      {rule.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <a href="/rules" className="text-sm font-bold text-accent hover:text-white transition-colors underline underline-offset-4">
            READ ALL COMPREHENSIVE RULES
          </a>
        </div>
      </div>
    </section>
  );
};

export default RulesPreview;
