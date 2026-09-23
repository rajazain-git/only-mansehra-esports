const Stats = () => {
  return (
    <section className="py-20 relative bg-background border-t border-gray-800">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
          
          <div className="flex flex-col items-center justify-center p-6">
            <span className="font-display text-5xl md:text-6xl text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">PKR 100K+</span>
            <span className="text-sm font-bold text-primary tracking-widest uppercase">Prize Pool</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-6">
            <span className="font-display text-5xl md:text-6xl text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">48</span>
            <span className="text-sm font-bold text-primary tracking-widest uppercase">Teams</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-6">
            <span className="font-display text-5xl md:text-6xl text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">3</span>
            <span className="text-sm font-bold text-primary tracking-widest uppercase">Stages</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-6">
            <span className="font-display text-5xl md:text-6xl text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">1</span>
            <span className="text-sm font-bold text-primary tracking-widest uppercase">Champion</span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Stats;
