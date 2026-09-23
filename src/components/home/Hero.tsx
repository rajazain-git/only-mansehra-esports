import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// Lightweight 3D Background Component
const Background3D = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <>
      <color attach="background" args={['#070707']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} color="#E50914" intensity={2} />
      <pointLight position={[-10, -10, -10]} color="#FF6A00" intensity={1} />
      
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef} position={[0, 0, -5]}>
          <icosahedronGeometry args={[3, 1]} />
          <meshStandardMaterial 
            color="#111111" 
            wireframe 
            emissive="#E50914" 
            emissiveIntensity={0.5} 
          />
        </mesh>
      </Float>
      
      <fog attach="fog" args={['#070707', 5, 20]} />
    </>
  );
};

const Hero = () => {
  return (
    <section className="relative w-full h-[calc(100vh-80px)] min-h-[600px] overflow-hidden flex items-center justify-center">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <Background3D />
        </Canvas>
        
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10" />
      </div>

      {/* Content */}
      <div className="container relative z-20 mx-auto px-4 flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mb-6 inline-block border border-primary/50 bg-primary/10 px-4 py-1 rounded-full text-primary text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(229,9,20,0.3)]"
        >
          Registration Open
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-wider text-white drop-shadow-2xl mb-4"
        >
          FREE FIRE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-glow">
            BATTLE ARENA
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-textMuted max-w-2xl text-sm md:text-base lg:text-lg mb-10"
        >
          Build your squad. Enter the arena. Fight for the championship. Experience the most premium competitive platform in the region.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
        >
          <Link
            to="/register"
            className="group relative px-8 py-4 bg-primary text-white font-bold tracking-widest overflow-hidden shadow-[0_0_20px_rgba(229,9,20,0.5)] hover:shadow-[0_0_30px_rgba(229,9,20,0.8)] transition-all skew-x-[-15deg]"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
            <div className="skew-x-[15deg]">REGISTER NOW</div>
          </Link>

          <Link
            to="/tournament"
            className="group relative px-8 py-4 bg-transparent border border-gray-600 hover:border-white text-white font-bold tracking-widest overflow-hidden transition-all skew-x-[-15deg]"
          >
            <div className="skew-x-[15deg] group-hover:scale-105 transition-transform">VIEW TOURNAMENT</div>
          </Link>
        </motion.div>

        {/* Countdown Placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 flex items-center justify-center gap-4 text-center"
        >
          <div className="flex flex-col items-center">
            <span className="font-display text-4xl md:text-5xl font-bold text-white">03</span>
            <span className="text-[10px] tracking-[0.2em] text-textMuted uppercase">Days</span>
          </div>
          <span className="text-2xl text-primary font-bold mb-4">:</span>
          <div className="flex flex-col items-center">
            <span className="font-display text-4xl md:text-5xl font-bold text-white">12</span>
            <span className="text-[10px] tracking-[0.2em] text-textMuted uppercase">Hours</span>
          </div>
          <span className="text-2xl text-primary font-bold mb-4">:</span>
          <div className="flex flex-col items-center">
            <span className="font-display text-4xl md:text-5xl font-bold text-white">48</span>
            <span className="text-[10px] tracking-[0.2em] text-textMuted uppercase">Mins</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
