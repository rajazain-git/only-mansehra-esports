import { Link } from 'react-router-dom';

const FinalCTA = () => {
  return (
    <section className="py-32 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center relative bg-fixed">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-background/90" />
      
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
          READY TO BECOME A <span className="text-primary">LEGEND?</span>
        </h2>
        <p className="text-gray-300 max-w-2xl text-lg mb-10">
          Slots are filling up fast. Gather your squad, register for the tournament, and prepare for the ultimate Free Fire battle.
        </p>
        
        <Link
          to="/register"
          className="group relative px-10 py-5 bg-primary text-white font-bold text-lg tracking-widest overflow-hidden shadow-[0_0_30px_rgba(224,0,42,0.6)] hover:shadow-[0_0_50px_rgba(224,0,42,0.9)] transition-all skew-x-[-15deg]"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
          <div className="skew-x-[15deg]">REGISTER YOUR TEAM NOW</div>
        </Link>
      </div>
    </section>
  );
};

export default FinalCTA;
