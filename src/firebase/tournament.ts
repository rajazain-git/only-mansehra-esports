import { doc, collection, serverTimestamp, increment, runTransaction, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';

export interface TeamRegistration {
  teamName: string;
  captainName: string;
  captainUid: string;
  players: { name: string; uid: string }[];
  whatsapp: string;
  email: string;
}

// Register for tournament and deduct tokens
export const registerTeamForTournament = async (
  userId: string,
  tournamentId: string,
  entryFee: number,
  registrationData: TeamRegistration
) => {
  try {
    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists()) {
        throw new Error('User does not exist');
      }

      const currentBalance = userDoc.data().tokenBalance || 0;

      if (currentBalance < entryFee) {
        throw new Error('Insufficient Tokens');
      }

      // 1. Deduct Tokens
      transaction.update(userRef, {
        tokenBalance: increment(-entryFee)
      });

      // 2. Create Transaction Record
      const transactionRef = doc(collection(db, 'transactions'));
      transaction.set(transactionRef, {
        userId,
        type: 'ENTRY_FEE',
        amount: entryFee,
        balanceBefore: currentBalance,
        balanceAfter: currentBalance - entryFee,
        reason: `Tournament Entry Fee for ${registrationData.teamName}`,
        createdAt: serverTimestamp(),
        referenceId: tournamentId
      });

      // 3. Create Registration Record
      const registrationRef = doc(collection(db, 'registrations'));
      transaction.set(registrationRef, {
        ...registrationData,
        userId,
        tournamentId,
        status: 'PENDING_APPROVAL',
        createdAt: serverTimestamp(),
      });
    });

    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Check if user is already registered for a tournament
export const checkRegistrationStatus = async (userId: string, tournamentId: string) => {
  try {
    const q = query(
      collection(db, 'registrations'), 
      where('userId', '==', userId),
      where('tournamentId', '==', tournamentId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking registration status:', error);
    return false;
  }
};

export interface SoloRegistration {
  playerName: string;
  gameUid: string;
  email: string;
  whatsapp: string;
  gameName: string;
}

export const registerSoloPlayer = async (
  userId: string,
  tournamentId: string,
  entryFee: number,
  registrationData: SoloRegistration
) => {
  try {
    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists()) {
        throw new Error('User does not exist');
      }

      const currentBalance = userDoc.data().tokenBalance || 0;

      if (currentBalance < entryFee) {
        throw new Error('Insufficient Tokens');
      }

      // 1. Deduct Tokens
      transaction.update(userRef, {
        tokenBalance: increment(-entryFee)
      });

      // 2. Create Transaction Record
      const transactionRef = doc(collection(db, 'transactions'));
      transaction.set(transactionRef, {
        userId,
        type: 'ENTRY_FEE_SOLO',
        amount: entryFee,
        balanceBefore: currentBalance,
        balanceAfter: currentBalance - entryFee,
        reason: `Solo Registration Fee for ${registrationData.gameName}`,
        createdAt: serverTimestamp(),
        referenceId: tournamentId
      });

      // 3. Create Solo Registration Record
      const registrationRef = doc(collection(db, 'solo_registrations'));
      transaction.set(registrationRef, {
        ...registrationData,
        userId,
        tournamentId,
        status: 'PENDING_APPROVAL',
        createdAt: serverTimestamp(),
      });
    });

    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const checkSoloRegistrationStatus = async (userId: string, tournamentId: string) => {
  try {
    const q = query(
      collection(db, 'solo_registrations'), 
      where('userId', '==', userId),
      where('tournamentId', '==', tournamentId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking solo registration status:', error);
    return false;
  }
};
export const registerPlayerOrTeam = async (
  userId: string,
  tournamentId: string,
  entryFee: number,
  mode: string,
  type: 'SOLO' | 'SQUAD',
  formData: any
) => {
  try {
    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists()) {
        throw new Error('User does not exist');
      }

      const currentBalance = userDoc.data().tokenBalance || 0;

      if (currentBalance < entryFee) {
        throw new Error('Insufficient Tokens');
      }

      // Check registration again inside transaction
      const q = query(
        collection(db, 'registrations'), 
        where('userId', '==', userId),
        where('tournamentId', '==', tournamentId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw new Error('User is already registered for this tournament');
      }

      // 1. Deduct Tokens
      transaction.update(userRef, {
        tokenBalance: increment(-entryFee)
      });

      // 2. Create Transaction Record
      const transactionRef = doc(collection(db, 'transactions'));
      transaction.set(transactionRef, {
        userId,
        type: 'ENTRY_FEE',
        amount: entryFee,
        balanceBefore: currentBalance,
        balanceAfter: currentBalance - entryFee,
        reason: `${type} Registration Fee for Tournament`,
        createdAt: serverTimestamp(),
        referenceId: tournamentId
      });

      // 3. Create Registration Record
      const registrationRef = doc(collection(db, 'registrations'));
      transaction.set(registrationRef, {
        ...formData,
        userId,
        tournamentId,
        mode,
        type,
        status: 'PENDING_APPROVAL',
        createdAt: serverTimestamp(),
      });
    });

    return { success: true };
  } catch (error) {
    throw error;
  }
};
