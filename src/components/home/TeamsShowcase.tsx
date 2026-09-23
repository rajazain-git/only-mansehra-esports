import { motion } from 'framer-motion';

const TEAMS = [
  { id: 1, name: 'ALPHA WOLVES', captain: 'AW_John', region: 'NA', logo: 'AW' },
  { id: 2, name: 'VENOM SQUAD', captain: 'VNM_Snake', region: 'SA', logo: 'VS' },
  { id: 3, name: 'CRIMSON ELITE', captain: 'CE_Blade', region: 'EU', logo: 'CE' },
  { id: 4, name: 'SHADOW GHOSTS', captain: 'SG_Phantom', region: 'ASIA', logo: 'SG' },
];

const TeamsShowcase = () => {
  return (
    <section className="py-24 bg-secondary border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">FEATURED <span className="text-primary">TEAMS</span></h2>
          <p className="text-textMuted max-w-2xl mx-auto">
            Meet some of the top contenders battling for the championship title.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAMS.map((team, idx) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-background border border-gray-800 p-6 relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gray-900 border border-gray-700 flex items-center justify-center mb-6 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(224,0,42,0.3)] transition-all duration-300 rotate-45">
                  <span className="font-display text-3xl text-gray-500 group-hover:text-primary -rotate-45 transition-colors">{team.logo}</span>
                </div>
                
                <h3 className="font-display text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{team.name}</h3>
                <div className="text-xs text-textMuted mb-4 space-y-1">
                  <p>CAPTAIN: <span className="text-gray-300">{team.captain}</span></p>
                  <p>REGION: <span className="text-gray-300">{team.region}</span></p>
                </div>
                
                <div className="inline-block px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold tracking-widest rounded-full">
                  REGISTERED
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamsShowcase;
