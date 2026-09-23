import { motion } from 'framer-motion';
import { Video } from 'lucide-react';

const LiveMatchPreview = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-gray-800">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-primary font-bold tracking-widest text-sm">LIVE NOW</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">MATCH <span className="text-primary">#08</span></h2>
            <p className="text-textMuted text-lg mt-1 font-display tracking-wider">MAP: BERMUDA</p>
          </div>
          
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-6 md:mt-0 flex items-center gap-2 bg-primary/20 text-primary border border-primary px-6 py-3 hover:bg-primary hover:text-white transition-all skew-x-[-15deg]"
          >
            <div className="skew-x-[15deg] flex items-center gap-2 font-bold text-sm">
              <Video size={20} />
              VIEW LIVE STREAM
            </div>
          </a>
        </div>

        {/* Mock Live Scoreboard */}
        <div className="bg-secondary border border-gray-800 overflow-hidden">
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-4 border-b border-gray-800 font-display text-textMuted tracking-wider bg-black/40">
            <div className="col-span-2 md:col-span-3">TEAM</div>
            <div className="text-center">KILLS</div>
            <div className="text-center hidden md:block">SURVIVAL</div>
            <div className="text-center">STATUS</div>
          </div>
          
          <div className="divide-y divide-gray-800">
            {[
              { name: 'TITAN ESPORTS', kills: 12, status: 'ALIVE', color: 'text-green-500' },
              { name: 'NINJA SQUAD', kills: 8, status: 'ALIVE', color: 'text-green-500' },
              { name: 'DRAGON SLAYERS', kills: 5, status: 'ELIMINATED', color: 'text-red-500' },
              { name: 'PHANTOM STRIKE', kills: 3, status: 'ELIMINATED', color: 'text-red-500' },
            ].map((team, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="grid grid-cols-4 md:grid-cols-6 gap-4 p-4 items-center hover:bg-white/5 transition-colors group"
              >
                <div className="col-span-2 md:col-span-3 flex items-center gap-3">
                  <span className="font-display text-gray-600 w-6">0{idx + 1}</span>
                  <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-500 group-hover:text-primary transition-colors">{team.name.charAt(0)}</span>
                  </div>
                  <span className="font-bold text-sm md:text-base">{team.name}</span>
                </div>
                <div className="text-center font-display text-xl">{team.kills}</div>
                <div className="text-center hidden md:block font-display text-xl">--</div>
                <div className={`text-center font-bold text-xs tracking-wider ${team.color}`}>{team.status}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveMatchPreview;
