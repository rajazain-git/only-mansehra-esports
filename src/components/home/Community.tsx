import { Video, Camera, MessageCircle, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

const Community = () => {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white drop-shadow-md">JOIN THE COMMUNITY</h2>
          <p className="text-white/80 max-w-2xl mx-auto mt-4">
            Connect with other players, find a squad, get real-time updates, and watch the live streams.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          
          <motion.a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex flex-col items-center justify-center p-6 bg-black/20 hover:bg-black/40 border border-white/20 w-40 h-40 transition-colors backdrop-blur-sm shadow-xl"
          >
            <Monitor size={40} className="text-white mb-4" />
            <span className="font-bold text-sm tracking-widest text-white">DISCORD</span>
          </motion.a>

          <motion.a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex flex-col items-center justify-center p-6 bg-black/20 hover:bg-black/40 border border-white/20 w-40 h-40 transition-colors backdrop-blur-sm shadow-xl"
          >
            <MessageCircle size={40} className="text-white mb-4" />
            <span className="font-bold text-sm tracking-widest text-white">WHATSAPP</span>
          </motion.a>

          <motion.a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex flex-col items-center justify-center p-6 bg-black/20 hover:bg-black/40 border border-white/20 w-40 h-40 transition-colors backdrop-blur-sm shadow-xl"
          >
            <Video size={40} className="text-white mb-4" />
            <span className="font-bold text-sm tracking-widest text-white">YOUTUBE</span>
          </motion.a>

          <motion.a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex flex-col items-center justify-center p-6 bg-black/20 hover:bg-black/40 border border-white/20 w-40 h-40 transition-colors backdrop-blur-sm shadow-xl"
          >
            <Camera size={40} className="text-white mb-4" />
            <span className="font-bold text-sm tracking-widest text-white">INSTAGRAM</span>
          </motion.a>

        </div>
      </div>
    </section>
  );
};

export default Community;
