const TournamentOverview = () => {
  return (
    <section className="py-20 bg-secondary border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">THE <span className="text-primary">BATTLEFIELD</span> AWAITS</h2>
          <p className="text-textMuted max-w-2xl mx-auto">
            Join the most competitive Free Fire tournament in the region. Prove your skills, climb the leaderboard, and win massive prizes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card p-8 hover:border-primary/50 hover:box-glow transition-all duration-300 group">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform border border-primary/20">
              <span className="font-display text-2xl">01</span>
            </div>
            <h3 className="font-display text-2xl mb-2 text-white group-hover:text-primary transition-colors">REGISTER TEAM</h3>
            <p className="text-sm text-textMuted">Gather your squad of 4 players, purchase entry tokens, and secure your slot in the qualifiers.</p>
          </div>
          
          {/* Card 2 */}
          <div className="glass-card p-8 hover:border-primary/50 hover:box-glow transition-all duration-300 group">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform border border-primary/20">
              <span className="font-display text-2xl">02</span>
            </div>
            <h3 className="font-display text-2xl mb-2 text-white group-hover:text-primary transition-colors">COMPETE</h3>
            <p className="text-sm text-textMuted">Battle through intense qualifiers and semifinals. Only the best teams will reach the Grand Final.</p>
          </div>
          
          {/* Card 3 */}
          <div className="glass-card p-8 hover:border-primary/50 hover:box-glow transition-all duration-300 group">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform border border-primary/20">
              <span className="font-display text-2xl">03</span>
            </div>
            <h3 className="font-display text-2xl mb-2 text-white group-hover:text-primary transition-colors">WIN PRIZES</h3>
            <p className="text-sm text-textMuted">Dominate the leaderboard to claim your share of the massive prize pool and exclusive championship titles.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TournamentOverview;
