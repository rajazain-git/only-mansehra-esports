import { collection, query, orderBy, getDocs, doc, runTransaction, serverTimestamp, increment } from 'firebase/firestore';
import { db } from './config';

export const getRegistrations = async () => {
  const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const approveRegistration = async (registrationId: string) => {
  await runTransaction(db, async (transaction) => {
    const regRef = doc(db, 'registrations', registrationId);
    transaction.update(regRef, { status: 'APPROVED' });
  });
};

export const rejectRegistration = async (registrationId: string) => {
  await runTransaction(db, async (transaction) => {
    const regRef = doc(db, 'registrations', registrationId);
    const regDoc = await transaction.get(regRef);
    if (!regDoc.exists()) throw new Error("Registration not found");

    const regData = regDoc.data();
    if (regData.status !== 'PENDING_APPROVAL') {
        throw new Error("Registration is not pending");
    }

    const { userId, tournamentId } = regData;

    // Get Tournament
    const tournamentRef = doc(db, 'tournaments', tournamentId);
    const tournamentDoc = await transaction.get(tournamentRef);
    
    if (tournamentDoc.exists()) {
      const tournamentData = tournamentDoc.data();
      const entryFee = tournamentData.entryFee || 0;
      
      // Get User
      if (userId) {
        const userRef = doc(db, 'users', userId);
        const userDoc = await transaction.get(userRef);
        if (userDoc.exists()) {
           const currentBalance = userDoc.data().tokenBalance || 0;
           
           // Refund user
           transaction.update(userRef, { tokenBalance: increment(entryFee) });
           
           // Record transaction
           const txRef = doc(collection(db, 'transactions'));
           transaction.set(txRef, {
             userId,
             type: 'REFUND',
             amount: entryFee,
             balanceBefore: currentBalance,
             balanceAfter: currentBalance + entryFee,
             reason: `Registration Rejected - Refund for Tournament`,
             createdAt: serverTimestamp(),
             referenceId: tournamentId
           });
        }
      }

      // Update tournament slots
      const currentParticipants = tournamentData.currentParticipants || 0;
      const tournamentUpdates: any = {
        currentParticipants: Math.max(0, currentParticipants - 1)
      };
      
      // If it was closed, re-open it
      if (tournamentData.registrationStatus === 'CLOSED') {
        tournamentUpdates.registrationStatus = 'OPEN';
      }
      
      transaction.update(tournamentRef, tournamentUpdates);
    }

    // Mark registration as rejected
    transaction.update(regRef, { status: 'REJECTED' });
  });
};

export const markAsWinner = async (registrationId: string) => {
  await runTransaction(db, async (transaction) => {
    const regRef = doc(db, 'registrations', registrationId);
    transaction.update(regRef, { 
      status: 'WINNER',
      celebrationSeen: false 
    });
  });
};
