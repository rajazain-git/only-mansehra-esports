import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Crown, Sparkles, Gem, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

interface BuyTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PACKAGES = [
  {
    id: 'bronze',
    name: 'BRONZE',
    baseTokens: 25,
    bonusTokens: 5,
    totalTokens: 30,
    price: 'PKR 500',
    accentColor: '#FF9800', // Warm Amber
    icon: <Zap size={24} />,
    glowClass: 'hover:shadow-[0_0_20px_#FF9800]',
    borderClass: 'group-hover:border-[#FF9800]',
    textClass: 'text-[#FF9800]',
    bgClass: 'bg-[#FF9800]',
  },
  {
    id: 'silver',
    name: 'SILVER',
    baseTokens: 50,
    bonusTokens: 5,
    bonusText: '(10% Bonus)',
    totalTokens: 55,
    price: 'PKR 1,000',
    accentColor: '#00E5FF', // Silver / Cyan
    icon: <ShieldAlert size={24} />,
    glowClass: 'hover:shadow-[0_0_20px_#00E5FF]',
    borderClass: 'group-hover:border-[#00E5FF]',
    textClass: 'text-[#00E5FF]',
    bgClass: 'bg-[#00E5FF]',
  },
  {
    id: 'gold',
    name: 'GOLD',
    badge: 'MOST POPULAR',
    baseTokens: 100,
    bonusTokens: 15,
    bonusText: '(15% Bonus)',
    totalTokens: 115,
    price: 'PKR 2,000',
    accentColor: '#FFD700', // Neon Gold
    icon: <Crown size={24} />,
    glowClass: 'hover:shadow-[0_0_30px_#FFD700]',
    borderClass: 'border-[#FFD700]/50 group-hover:border-[#FFD700]',
    textClass: 'text-[#FFD700]',
    bgClass: 'bg-[#FFD700]',
  },
  {
    id: 'platinum',
    name: 'PLATINUM',
    baseTokens: 250,
    bonusTokens: 50,
    bonusText: '(20% Bonus)',
    totalTokens: 300,
    price: 'PKR 5,000',
    accentColor: '#A855F7', // Electric Purple
    icon: <Sparkles size={24} />,
    glowClass: 'hover:shadow-[0_0_20px_#A855F7]',
    borderClass: 'group-hover:border-[#A855F7]',
    textClass: 'text-[#A855F7]',
    bgClass: 'bg-[#A855F7]',
  },
  {
    id: 'diamond',
    name: 'DIAMOND',
    baseTokens: 500,
    bonusTokens: 125,
    bonusText: '(25% Bonus)',
    totalTokens: 625,
    price: 'PKR 10,000',
    accentColor: '#00F0FF', // Diamond Aqua
    icon: <Gem size={24} />,
    glowClass: 'hover:shadow-[0_0_20px_#00F0FF]',
    borderClass: 'group-hover:border-[#00F0FF]',
    textClass: 'text-[#00F0FF]',
    bgClass: 'bg-[#00F0FF]',
  },
  {
    id: 'mythic',
    name: 'MYTHIC',
    badge: 'BEST VALUE',
    baseTokens: 1000,
    bonusTokens: 300,
    bonusText: '(30% Bonus)',
    totalTokens: 1300,
    price: 'PKR 20,000',
    accentColor: '#FF003C', // Crimson Neon Red
    icon: <Crown size={24} />,
    glowClass: 'hover:shadow-[0_0_30px_#FF003C]',
    borderClass: 'border-[#FF003C]/50 group-hover:border-[#FF003C]',
    textClass: 'text-[#FF003C]',
    bgClass: 'bg-[#FF003C]',
  },
];

const BuyTokensModal = ({ isOpen, onClose }: BuyTokensModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-secondary/95 border border-gray-800 w-full max-w-6xl max-h-[90vh] overflow-y-auto pointer-events-auto relative shadow-2xl custom-scrollbar"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-secondary/90 backdrop-blur-md border-b border-gray-800 p-6 flex justify-between items-center">
                <div>
                  <h2 className="font-display text-3xl font-bold text-white tracking-wider">
                    ACQUIRE <span className="text-primary">TOKENS</span>
                  </h2>
                  <p className="text-textMuted text-sm mt-1">Fuel your esports journey. Select a package below.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-gray-800/50 hover:bg-gray-800 text-textMuted hover:text-white flex items-center justify-center transition-colors border border-gray-700 hover:border-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Grid */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PACKAGES.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={clsx(
                        "group relative bg-black/40 border border-gray-800 p-6 transition-all duration-300 flex flex-col h-full",
                        pkg.glowClass,
                        pkg.borderClass
                      )}
                    >
                      {/* Badge */}
                      {pkg.badge && (
                        <div className={clsx(
                          "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-[10px] font-bold tracking-widest text-black shadow-lg z-10",
                          pkg.bgClass
                        )}>
                          {pkg.badge}
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className={clsx("p-2 bg-white/5 border border-white/10", pkg.textClass)}>
                            {pkg.icon}
                          </div>
                          <h3 className={clsx("font-display text-xl tracking-widest", pkg.textClass)}>
                            {pkg.name}
                          </h3>
                        </div>
                      </div>

                      {/* Tokens Math */}
                      <div className="mb-6 flex-grow">
                        <div className="flex items-end gap-2 mb-2">
                          <span className="font-display text-5xl text-white leading-none">{pkg.totalTokens}</span>
                          <span className="text-textMuted text-sm font-bold tracking-widest pb-1">TOKENS</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-textMuted bg-white/5 px-3 py-2 border border-white/5">
                          <span>{pkg.baseTokens} Base</span>
                          <span className="text-gray-600">+</span>
                          <span className={pkg.textClass}>{pkg.bonusTokens} Bonus</span>
                          {pkg.bonusText && <span className="text-xs opacity-70">{pkg.bonusText}</span>}
                        </div>
                      </div>

                      {/* Footer / CTA */}
                      <div className="mt-auto border-t border-gray-800 pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs text-textMuted font-bold tracking-widest">PRICE</span>
                          <span className="font-display text-2xl text-white">{pkg.price}</span>
                        </div>
                        <button
                          onClick={() => alert('Checkout integration coming soon!')}
                          className={clsx(
                            "w-full py-3 font-bold tracking-widest text-sm transition-all duration-300 border",
                            "bg-white/5 hover:bg-white/10 text-white",
                            pkg.borderClass
                          )}
                          style={{
                            boxShadow: `0 0 10px ${pkg.accentColor}20`
                          }}
                        >
                          PURCHASE PACKAGE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BuyTokensModal;
