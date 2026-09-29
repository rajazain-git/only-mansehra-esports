import { collection, doc, setDoc, updateDoc, deleteDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './config';

export type GameMode = 'BATTLE_ROYALE' | 'CLASH_SQUAD' | 'LONE_WOLF';

export interface Tournament {
  id: string;
  name: string;
  mode: GameMode;
  brOptions?: {
    solo: boolean;
    squad: boolean;
  };
  entryFee: number;
  registrationStatus: 'OPEN' | 'CLOSED';
  startDate: Timestamp | null;
  maxParticipants?: number;
  currentParticipants?: number;
  posterUrl?: string;
  prizePool?: string;
  description?: string;
  createdAt: Timestamp;
}

export interface Room {
  id: string;
  tournamentId: string;
  name: string;
  slotLimit: number;
  registeredCount: number;
  startTime: Timestamp | null;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED';
  roomDetails: string;
  createdAt: Timestamp;
}

// Tournaments API
export const getTournaments = async (): Promise<Tournament[]> => {
  const q = query(collection(db, 'tournaments'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
};

export const createTournament = async (data: Omit<Tournament, 'id' | 'createdAt'>) => {
  const newRef = doc(collection(db, 'tournaments'));
  await setDoc(newRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return newRef.id;
};

export const updateTournament = async (id: string, data: Partial<Tournament>) => {
  const ref = doc(db, 'tournaments', id);
  await updateDoc(ref, data);
};

export const deleteTournament = async (id: string) => {
  const ref = doc(db, 'tournaments', id);
  await deleteDoc(ref);
};

// Rooms API
export const getRooms = async (tournamentId: string): Promise<Room[]> => {
  const q = query(collection(db, `tournaments/${tournamentId}/rooms`), orderBy('createdAt', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
};

export const createRoom = async (tournamentId: string, data: Omit<Room, 'id' | 'tournamentId' | 'createdAt' | 'registeredCount'>) => {
  const newRef = doc(collection(db, `tournaments/${tournamentId}/rooms`));
  await setDoc(newRef, {
    ...data,
    tournamentId,
    registeredCount: 0,
    createdAt: serverTimestamp(),
  });
  return newRef.id;
};

export const updateRoom = async (tournamentId: string, roomId: string, data: Partial<Room>) => {
  const ref = doc(db, `tournaments/${tournamentId}/rooms`, roomId);
  await updateDoc(ref, data);
};

export const deleteRoom = async (tournamentId: string, roomId: string) => {
  const ref = doc(db, `tournaments/${tournamentId}/rooms`, roomId);
  await deleteDoc(ref);
};
