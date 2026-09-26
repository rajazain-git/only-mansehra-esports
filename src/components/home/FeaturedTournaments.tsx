import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Trophy, Users, ChevronRight } from 'lucide-react';

// Helper to generate elegant dark cinematic SVG placeholders locally
const generatePlaceholder = (text: string) => {
  const bg = "#0B0B0F";
  const accent = "#E0002A";
  const textCol = "#D4D4D8";
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <rect width="800" height="800" fill="${bg}"/>
    <path d="M0 0L800 800M800 0L0 800" stroke="${accent}" stroke-width="2" opacity="0.05"/>
    <circle cx="400" cy="400" r="300" fill="none" stroke="${accent}" stroke-width="1" opacity="0.1"/>
    <circle cx="400" cy="400" r="280" fill="none" stroke="${accent}" stroke-width="4" opacity="0.15"/>
    <path d="M400 150L616.5 525H183.5Z" fill="none" stroke="${accent}" stroke-width="2" opacity="0.1"/>
    <text x="400" y="420" font-family="sans-serif" font-size="48" font-weight="bold" fill="${textCol}" text-anchor="middle" letter-spacing="8" opacity="0.8">${text}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const TOURNAMENTS = [
  {
    id: 't1',
    title: 'ONLY MANSEHRA CUP',
    category: 'Battle Royale',
    status: 'UPCOMING',
    prizePool: 'Coming Soon',
    description: 'Compete with your squad in the next Only Mansehra Esports tournament.',
    image: generatePlaceholder('OMC')
  },
  {
    id: 't2',
    title: 'WEEKLY CLASH',
    category: 'Squad Battle',
    status: 'ACTIVE',
    prizePool: 'Coming Soon',
    description: 'Fast-paced squad competition for teams ready to prove themselves.',
    image: generatePlaceholder('CLASH')
  },
  {
    id: 't3',
    title: 'SQUAD CHAMPIONSHIP',
    category: 'Championship',
    status: 'UPCOMING',
    prizePool: 'Coming Soon',
    description: 'A premium championship event featuring competitive squad matches.',
    image: generatePlaceholder('CHAMPIONSHIP')
  },
  {
    id: 't4',
    title: 'NIGHT BATTLE',
    category: 'Special Event',
    status: 'UPCOMING',
    prizePool: 'Coming Soon',
    description: 'A special nighttime esports battle for registered teams.',
    image: generatePlaceholder('NIGHT')
  }
];

const FeaturedTournaments = () => {
  const [activeId, setActiveId] = useState(TOURNAMENTS[0].id);
  const shouldReduceMotion = useReducedMotion();

  const activeTournament = TOURNAMENTS.find(t => t.id === activeId) || TOURNAMENTS[0];

  return (
    <section className="py-20 relative border-t border-gray-800 overflow-hidden bg-background">
      {/* Background Video */}
      {!shouldReduceMotion && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-luminosity"
        >
          <source src="/videos/tournament-bg.mp4" type="video/mp4" />
        </video>
      )}
      
      {/* Dark Cinematic Overlay with Subtle Crimson Gradient */}
      <div className="absolute inset-0 bg-background/70 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-background z-0 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-wider">
            FEATURED <span className="text-primary">TOURNAMENTS</span>
          </h2>
          <p className="text-textMuted text-sm md:text-base tracking-widest uppercase font-bold">
            Explore the latest battles and upcoming competitions
          </p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[500px]">
          
          {/* Left: List */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {TOURNAMENTS.map((t) => {
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  onMouseEnter={() => setActiveId(t.id)}
                  onClick={() => setActiveId(t.id)}
                  onFocus={() => setActiveId(t.id)}
                  className={`group relative w-full text-left p-6 transition-all duration-300 border-l-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive 
                      ? 'border-primary bg-secondary/80 shadow-[0_0_20px_rgba(224,0,42,0.15)]' 
                      : 'border-transparent hover:border-primary/50 hover:bg-secondary/40'
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <span className="block text-xs font-bold tracking-widest text-textMuted mb-1 uppercase">
                        {t.category}
                      </span>
                      <h3 className={`font-display text-2xl uppercase tracking-wider transition-colors ${
                        isActive ? 'text-primary text-glow' : 'text-white group-hover:text-primary/80'
                      }`}>
                        {t.title}
                      </h3>
                    </div>
                    <ChevronRight className={`transition-transform duration-300 ${isActive ? 'text-primary translate-x-2' : 'text-gray-600'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Center: Image Preview */}
          <div className="lg:col-span-4 relative overflow-hidden glass-card aspect-square lg:aspect-auto flex items-center justify-center bg-[#0B0B0F]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeTournament.id}
                src={activeTournament.image}
                alt={activeTournament.title}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40 transition-all duration-500 hover:mix-blend-normal hover:opacity-80"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/50" />
            
            {/* Overlay icon or subtle detail could go here */}
            <div className="absolute inset-0 border border-primary/20 pointer-events-none" />
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-4 flex flex-col justify-center glass-card p-8 lg:p-10 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTournament.id}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col h-full relative z-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`px-3 py-1 text-xs font-bold tracking-widest uppercase border ${
                    activeTournament.status === 'ACTIVE' 
                      ? 'border-primary text-primary bg-primary/10' 
                      : 'border-silver text-silver bg-silver/10'
                  }`}>
                    {activeTournament.status}
                  </div>
                </div>

                <h3 className="font-display text-4xl md:text-5xl text-white mb-4 uppercase tracking-wider drop-shadow-lg">
                  {activeTournament.title}
                </h3>
                
                <p className="text-textMuted mb-8 leading-relaxed">
                  {activeTournament.description}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 text-sm font-bold tracking-widest text-silver">
                    <Trophy size={18} className="text-primary" />
                    <span>PRIZE POOL: {activeTournament.prizePool}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold tracking-widest text-silver">
                    <Users size={18} className="text-primary" />
                    <span>CATEGORY: {activeTournament.category}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <button className="w-full py-4 border border-primary text-primary font-bold tracking-widest uppercase hover:bg-primary hover:text-white transition-all duration-300 box-glow skew-x-[-10deg]">
                    <div className="skew-x-[10deg]">VIEW DETAILS</div>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Subtle background glow for the active card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none rounded-full" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedTournaments;
