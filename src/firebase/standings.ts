import { collection, doc, setDoc, getDocs, query, where, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './config';

export interface Standing {
  id: string; // tournamentId_regId
  tournamentId: string;
  mode: string;
  regId: string;
  name: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  points: number;
  updatedAt: any;
}

export const getStandings = async (mode?: string, tournamentId?: string): Promise<Standing[]> => {
  let q = query(collection(db, 'standings'));
  
  if (tournamentId) {
    q = query(collection(db, 'standings'), where('tournamentId', '==', tournamentId));
  } else if (mode) {
    q = query(collection(db, 'standings'), where('mode', '==', mode));
  }

  const snap = await getDocs(q);
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() } as Standing));
  
  // Sort by points desc, wins desc
  return results.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });
};

export const updateStanding = async (standingId: string, updates: Partial<Standing>) => {
  const ref = doc(db, 'standings', standingId);
  await setDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const computeStandings = async (tournamentId: string) => {
  // Fetch tournament to get mode
  const { getDoc } = await import('firebase/firestore');
  const tDoc = await getDoc(doc(db, 'tournaments', tournamentId));
  const tData = tDoc.data();
  if (!tData) return;
  const mode = tData.mode;

  // Fetch all matches
  const matchSnap = await getDocs(query(collection(db, 'matches'), where('tournamentId', '==', tournamentId), where('status', '==', 'COMPLETED')));
  
  // Fetch all registrations
  const regSnap = await getDocs(query(collection(db, 'registrations'), where('tournamentId', '==', tournamentId)));
  const regs = regSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

  const stats: Record<string, { wins: number, losses: number, matchesPlayed: number, points: number }> = {};
  
  regs.forEach(r => {
    stats[r.id] = { wins: 0, losses: 0, matchesPlayed: 0, points: 0 };
  });

  matchSnap.docs.forEach(mDoc => {
    const m = mDoc.data() as any;
    m.participants.forEach((p: any) => {
      if (!p.regId || !stats[p.regId]) return;
      stats[p.regId].matchesPlayed += 1;
      if (m.winnerRegId === p.regId) {
        stats[p.regId].wins += 1;
        stats[p.regId].points += (mode === 'BATTLE_ROYALE' ? 100 : 10);
      } else {
        stats[p.regId].losses += 1;
      }
    });
  });

  const batch = writeBatch(db);
  for (const reg of regs) {
    const s = stats[reg.id];
    if (s && s.matchesPlayed > 0) {
       const standingId = `${tournamentId}_${reg.id}`;
       const ref = doc(db, 'standings', standingId);
       batch.set(ref, {
         tournamentId,
         mode,
         regId: reg.id,
         name: reg.teamName || reg.playerName || 'Player',
         matchesPlayed: s.matchesPlayed,
         wins: s.wins,
         losses: s.losses,
         points: s.points,
         updatedAt: serverTimestamp()
       });
    }
  }
  await batch.commit();
};
