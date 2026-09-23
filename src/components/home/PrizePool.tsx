import { motion } from 'framer-motion';

const PrizePool = () => {
  return (
    <section className="py-24 bg-secondary border-t border-gray-800 relative overflow-hidden">
      {/* Abstract Background for Prize Pool */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold via-background to-background"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">PRIZE <span className="text-gold">POOL</span></h2>
          <p className="text-textMuted max-w-2xl mx-auto">
            Massive rewards await those who conquer the arena. Total prize pool: PKR 100,000.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
          
          {/* 2nd Place */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/3 order-2 md:order-1"
          >
            <div className="bg-background border border-gray-700 p-6 text-center hover:border-gray-400 transition-colors relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-400 rotate-45 flex items-center justify-center">
                <span className="font-display text-background -rotate-45 text-2xl font-bold">2</span>
              </div>
              <h3 className="font-display text-2xl text-gray-400 mt-6 mb-2">RUNNER UP</h3>
              <p className="font-display text-4xl text-white">PKR 50,000</p>
              <p className="text-xs text-textMuted mt-4">+ Exclusive Runner-up Badge</p>
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/3 order-1 md:order-2 z-10 md:-translate-y-8"
          >
            <div className="bg-background border border-gold p-8 text-center shadow-[0_0_30px_rgba(255,209,102,0.15)] relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gold rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(255,209,102,0.4)]">
                <span className="font-display text-background -rotate-45 text-4xl font-bold">1</span>
              </div>
              <h3 className="font-display text-3xl text-gold mt-8 mb-2 drop-shadow-[0_0_5px_rgba(255,209,102,0.5)]">CHAMPION</h3>
              <p className="font-display text-5xl text-white font-bold">PKR 100,000</p>
              <p className="text-xs text-textMuted mt-4">+ Championship Trophy & Title</p>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/3 order-3 md:order-3"
          >
            <div className="bg-background border border-[#CD7F32] p-6 text-center hover:border-[#CD7F32]/80 transition-colors relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#CD7F32] rotate-45 flex items-center justify-center">
                <span className="font-display text-background -rotate-45 text-2xl font-bold">3</span>
              </div>
              <h3 className="font-display text-2xl text-[#CD7F32] mt-6 mb-2">3RD PLACE</h3>
              <p className="font-display text-4xl text-white">PKR 25,000</p>
              <p className="text-xs text-textMuted mt-4">+ Bronze Finalist Badge</p>
            </div>
          </motion.div>

        </div>
        
        {/* Additional Prizes */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {['MVP OF THE TOURNAMENT', 'TOP KILLER', 'BEST CLUTCH'].map((title, idx) => (
            <div key={idx} className="border border-gray-800 p-4 text-center hover:bg-white/5 transition-colors">
              <h4 className="text-xs text-textMuted font-bold tracking-widest mb-2">{title}</h4>
              <p className="font-display text-2xl text-accent">5,000 TOKENS</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrizePool;
