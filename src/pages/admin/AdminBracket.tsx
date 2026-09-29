import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getMatches, generateSingleElimination, type Match, updateMatchResult } from '../../firebase/bracket';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export default function AdminBracket() {
  const { id: tournamentId } = useParams<{ id: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

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

  const handleGenerate = async () => {
    if (!tournamentId) return;
    if (!confirm("This will overwrite any existing bracket for this tournament. Continue?")) return;
    
    setGenerating(true);
    try {
      // 1. Fetch approved registrations
      const q = query(collection(db, 'registrations'), where('tournamentId', '==', tournamentId), where('status', '==', 'APPROVED'));
      const snap = await getDocs(q);
      const regs = snap.docs.map(d => ({
        id: d.id,
        name: d.data().teamName || d.data().playerName || 'Player'
      }));

      await generateSingleElimination(tournamentId, regs);
      await fetchBracket();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to generate bracket.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSetWinner = async (match: Match, winnerRegId: string | null) => {
    if (!winnerRegId) return;
    if (!confirm("Confirm this result? It will advance the winner.")) return;

    try {
      await updateMatchResult(match.id, {
        winnerRegId,
        status: 'COMPLETED'
      });
      
      // Advance winner if there is a next match
      if (match.nextMatchId) {
        const nextMatch = matches.find(m => m.id === match.nextMatchId);
        if (nextMatch) {
          const updatedParticipants = [...nextMatch.participants];
          // Replace a TBD (BYE) or empty slot
          const emptySlotIndex = updatedParticipants.findIndex(p => p.regId === null);
          const winnerParticipant = match.participants.find(p => p.regId === winnerRegId);
          
          if (emptySlotIndex !== -1 && winnerParticipant) {
             updatedParticipants[emptySlotIndex] = winnerParticipant;
          } else {
             // Just append if no empty slots were initialized
             if (winnerParticipant) {
               updatedParticipants.push(winnerParticipant);
             }
          }
          
          await updateMatchResult(nextMatch.id, {
            participants: updatedParticipants,
            status: updatedParticipants.length >= 2 ? 'SCHEDULED' : nextMatch.status
          });
        }
      }
      
      const { computeStandings } = await import('../../firebase/standings');
      if (tournamentId) await computeStandings(tournamentId);

      await fetchBracket();
    } catch (err) {
      console.error(err);
      alert("Failed to save result.");
    }
  };

  if (loading) return <div className="p-10 text-white">Loading bracket...</div>;

  const rounds = Array.from(new Set(matches.map(m => m.round))).sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h2 className="font-display text-3xl text-white tracking-wider">BRACKET MANAGEMENT</h2>
          <p className="text-textMuted text-sm">Manage bracket for tournament</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-primary text-white font-bold text-sm tracking-widest px-6 py-2 skew-x-[-10deg] hover:bg-white hover:text-primary transition-colors disabled:opacity-50"
        >
          <div className="skew-x-[10deg] flex items-center gap-2">
            <RotateCcw size={16} className={generating ? 'animate-spin' : ''} />
            {matches.length > 0 ? 'REGENERATE BRACKET' : 'GENERATE BRACKET'}
          </div>
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-20 bg-secondary/50 border border-dashed border-gray-800">
          <p className="text-textMuted">No bracket exists for this tournament.</p>
        </div>
      ) : (
        <div className="flex gap-8 overflow-x-auto pb-10">
          {rounds.map(roundNum => {
            const roundMatches = matches.filter(m => m.round === roundNum).sort((a, b) => a.matchNumber - b.matchNumber);
            return (
              <div key={roundNum} className="flex flex-col gap-6 min-w-[280px]">
                <h3 className="font-display text-xl text-white border-b border-gray-800 pb-2 mb-2 text-center">
                  ROUND {roundNum}
                </h3>
                {roundMatches.map(m => (
                  <div key={m.id} className={`bg-secondary border p-4 ${m.status === 'COMPLETED' ? 'border-green-500/50' : 'border-gray-800'}`}>
                    <div className="text-xs text-textMuted mb-2 flex justify-between">
                      <span>Match {m.matchNumber + 1}</span>
                      <span className={m.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'}>{m.status}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {m.participants.length > 0 ? m.participants.map((p, idx) => (
                        <div 
                          key={idx} 
                          className={`flex justify-between items-center p-2 border ${m.winnerRegId === p.regId ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-black/50 border-gray-800 text-white'}`}
                        >
                          <span className="font-bold text-sm truncate max-w-[150px]">{p.name || 'TBA'}</span>
                          {m.status !== 'COMPLETED' && p.regId && (
                            <button 
                              onClick={() => handleSetWinner(m, p.regId)}
                              className="text-xs bg-gray-800 hover:bg-green-500 hover:text-black px-2 py-1 rounded"
                            >
                              WIN
                            </button>
                          )}
                          {m.winnerRegId === p.regId && <CheckCircle2 size={14} />}
                        </div>
                      )) : (
                        <div className="p-2 bg-black/50 border border-gray-800 text-textMuted text-sm italic text-center">TBA vs TBA</div>
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
  );
}
