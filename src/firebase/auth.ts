import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './config';
import type { UserProfile } from '../store/useAuthStore';

// Register User
export const registerUser = async (email: string, password: string, fullName: string, username: string, phone: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Auth Profile
    await updateProfile(user, { displayName: username });

    // Create Firestore User Document
    const userDocRef = doc(db, 'users', user.uid);
    const newUserProfile = {
      uid: user.uid,
      fullName,
      username,
      email,
      phone,
      role: 'user' as const, // Default role
      tokenBalance: 0, // Default balance
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userDocRef, newUserProfile);

    return { user, profile: newUserProfile };
  } catch (error) {
    throw error;
  }
};

// Login User
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch Profile
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return { user, profile: userDoc.data() as UserProfile };
    } else {
      throw new Error('User profile not found in database.');
    }
  } catch (error) {
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
