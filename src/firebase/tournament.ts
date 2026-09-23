import { doc, collection, serverTimestamp, increment, runTransaction } from 'firebase/firestore';
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
