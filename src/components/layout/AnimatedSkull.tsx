import { motion, useReducedMotion } from 'framer-motion';

const AnimatedSkull = () => {
  const shouldReduceMotion = useReducedMotion();

  const floatAnimation: any = shouldReduceMotion ? {} : {
    y: [0, -15, 0],
    opacity: [0.04, 0.07, 0.04],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      <motion.div 
        animate={floatAnimation}
        initial={{ opacity: 0.04 }}
        className="relative w-full max-w-[800px] aspect-square opacity-[0.05] md:opacity-[0.08] mix-blend-screen"
      >
        <svg 
          viewBox="0 0 512 512" 
          fill="none" 
          xmlns="http://www.w3.org/2000/01/svg"
          className="w-full h-full text-primary"
        >
          {/* Generic Esports Skull Vector */}
          <path 
            d="M256 32C167.6 32 96 103.6 96 192C96 238.4 115.6 280.2 147.2 310.2L160 384L192 480H320L352 384L364.8 310.2C396.4 280.2 416 238.4 416 192C416 103.6 344.4 32 256 32ZM176 224C149.5 224 128 202.5 128 176C128 149.5 149.5 128 176 128C202.5 128 224 149.5 224 176C224 202.5 202.5 224 176 224ZM336 224C309.5 224 288 202.5 288 176C288 149.5 309.5 128 336 128C362.5 128 384 149.5 384 176C384 202.5 362.5 224 336 224ZM256 320L224 288H288L256 320ZM208 416L224 352H288L304 416H208Z" 
            fill="currentColor"
          />
          {/* Subtle glowing eyes */}
          <circle cx="176" cy="176" r="24" fill="currentColor" opacity="0.5" />
          <circle cx="336" cy="176" r="24" fill="currentColor" opacity="0.5" />
        </svg>
      </motion.div>
    </div>
  );
};

export default AnimatedSkull;
