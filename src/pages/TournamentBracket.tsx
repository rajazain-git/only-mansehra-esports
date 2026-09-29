import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMatches, type Match } from '../firebase/bracket';
import { Swords } from 'lucide-react';

export default function TournamentBracket() {
  const { id: tournamentId } = useParams<{ id: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tournamentId) fetchBracket();
  }, [tournamentId]);

  const fetchBracket = async () => {
    if (!tournamentId) return;
    setLoading(true);
    const data = await getMatches(tournamentId);
    setMatches(data);
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen py-24 px-4 bg-background flex justify-center items-center">
       <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const rounds = Array.from(new Set(matches.map(m => m.round))).sort((a, b) => b - a);

  return (
    <div className="min-h-screen py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white tracking-wider mb-4">
            TOURNAMENT <span className="text-primary">BRACKET</span>
          </h1>
          <p className="text-textMuted max-w-2xl mx-auto">Follow the live matches and see who will emerge as the champion.</p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-20 bg-secondary/50 border border-gray-800 max-w-3xl mx-auto">
            <Swords size={48} className="mx-auto text-gray-700 mb-4" />
            <h3 className="font-display text-2xl text-white tracking-widest mb-2">BRACKET NOT GENERATED YET</h3>
            <p className="text-textMuted">The tournament admins are still finalizing the participants.</p>
          </div>
        ) : (
          <div className="flex gap-8 overflow-x-auto pb-10 max-w-full">
            {rounds.map(roundNum => {
              const roundMatches = matches.filter(m => m.round === roundNum).sort((a, b) => a.matchNumber - b.matchNumber);
              return (
                <div key={roundNum} className="flex flex-col justify-around gap-6 min-w-[280px]">
                  <h3 className="font-display text-xl text-white border-b border-gray-800 pb-2 mb-2 text-center sticky left-0">
                    ROUND {roundNum}
                  </h3>
                  {roundMatches.map(m => (
                    <div key={m.id} className={`bg-secondary border p-4 ${m.status === 'COMPLETED' ? 'border-primary/50' : 'border-gray-800'}`}>
                      <div className="text-[10px] font-bold tracking-widest text-textMuted mb-2 flex justify-between">
                        <span>MATCH {m.matchNumber + 1}</span>
                        <span className={m.status === 'COMPLETED' ? 'text-primary' : 'text-yellow-500'}>{m.status}</span>
                      </div>
                      
                      <div className="space-y-1">
                        {m.participants.length > 0 ? m.participants.map((p, idx) => (
                          <div 
                            key={idx} 
                            className={`p-2 border ${m.winnerRegId === p.regId ? 'bg-primary/20 border-primary text-white' : 'bg-black/50 border-gray-800 text-gray-300'}`}
                          >
                            <span className={`font-bold text-sm truncate block ${m.winnerRegId === p.regId ? 'text-white' : ''}`}>
                              {p.name || 'TBA'}
                            </span>
                          </div>
                        )) : (
                          <>
                            <div className="p-2 bg-black/50 border border-gray-800 text-gray-600 text-sm italic text-center">TBA</div>
                            <div className="p-2 bg-black/50 border border-gray-800 text-gray-600 text-sm italic text-center">TBA</div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
