import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';

export const getUserRegistrations = async (userId: string) => {
  try {
    // We will query the unified 'registrations' collection.
    // If the system still uses 'solo_registrations', we might need to query that too 
    // for backward compatibility, but the prompt says to use unified.
    
    // 1. Fetch unified registrations
    const regQuery = query(
      collection(db, 'registrations'),
      where('userId', '==', userId),
    );
    const regSnap = await getDocs(regQuery);
    const registrations = regSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 2. Fetch solo_registrations for legacy compatibility
    const soloQuery = query(
      collection(db, 'solo_registrations'),
      where('userId', '==', userId),
    );
    const soloSnap = await getDocs(soloQuery);
    const soloRegistrations = soloSnap.docs.map(doc => ({ id: doc.id, type: 'SOLO', mode: 'BATTLE_ROYALE', ...doc.data() }));

    return [...registrations, ...soloRegistrations].sort((a: any, b: any) => {
      const aTime = a.createdAt?.toMillis() || 0;
      const bTime = b.createdAt?.toMillis() || 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    return [];
  }
};
