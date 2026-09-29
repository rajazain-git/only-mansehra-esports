import { collection, doc, updateDoc, getDocs, query, where, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './config';

export type MatchStatus = 'PENDING' | 'SCHEDULED' | 'READY' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

export interface MatchParticipant {
  regId: string | null;
  name: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  participants: MatchParticipant[];
  winnerRegId: string | null;
  status: MatchStatus;
  nextMatchId: string | null;
  scheduledTime?: any;
  scores?: Record<string, number>;
  createdAt: any;
  updatedAt: any;
}

export const getMatches = async (tournamentId: string): Promise<Match[]> => {
  const q = query(collection(db, 'matches'), where('tournamentId', '==', tournamentId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Match));
};

export const generateSingleElimination = async (tournamentId: string, participants: {id: string, name: string}[]) => {
  const batch = writeBatch(db);
  const total = participants.length;
  if (total < 2) throw new Error("Bracket generate karne ke liye kam iz kam 2 'APPROVED' players ya teams ka hona zaroori hai. Pehle Admin Panel > Registrations mein ja kar logon ko approve karein.");

  const rounds = Math.ceil(Math.log2(total));
  
  const matches: any[] = [];
  const matchMap = new Map<string, string>(); 

  // Create matches
  for (let r = rounds; r >= 1; r--) {
    const matchesInRound = Math.pow(2, rounds - r);
    for (let m = 0; m < matchesInRound; m++) {
      const matchId = `${tournamentId}_R${r}_M${m}`;
      matchMap.set(`${r}-${m}`, matchId);
      
      let nextMatchId = null;
      if (r < rounds) {
        const parentIndex = Math.floor(m / 2);
        nextMatchId = matchMap.get(`${r + 1}-${parentIndex}`);
      }

      const matchDoc = {
        id: matchId,
        tournamentId,
        round: r,
        matchNumber: m,
        participants: [],
        winnerRegId: null,
        status: 'PENDING',
        nextMatchId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      matches.push(matchDoc);
    }
  }
  
  // Assign participants
  const round1Matches = matches.filter(m => m.round === 1);
  let pIndex = 0;
  
  for (let i = 0; i < round1Matches.length; i++) {
    const m = round1Matches[i];
    const p1 = participants[pIndex++];
    const p2 = participants[pIndex++];
    
    m.participants.push({ regId: p1 ? p1.id : null, name: p1 ? p1.name : 'TBD (BYE)' });
    m.participants.push({ regId: p2 ? p2.id : null, name: p2 ? p2.name : 'TBD (BYE)' });
    
    m.status = 'SCHEDULED';
  }

  for (const m of matches) {
    const ref = doc(db, 'matches', m.id);
    batch.set(ref, m);
  }

  await batch.commit();
  return matches;
};

export const updateMatchResult = async (matchId: string, updates: Partial<Match>) => {
  const ref = doc(db, 'matches', matchId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};
