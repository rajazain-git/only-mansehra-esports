import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { useAuthStore } from './store/useAuthStore';
import type { UserProfile } from './store/useAuthStore';

import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tournament from './pages/Tournament';
import SoloTournament from './pages/SoloTournament';
import GameModes from './pages/GameModes';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegistrations from './pages/admin/AdminRegistrations';

import Registration from './pages/Registration';
import AdminTournaments from './pages/admin/AdminTournaments';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'tournament', element: <Tournament /> },
      { path: 'solo-tournament', element: <SoloTournament /> },
      { path: 'schedule', element: <div className="p-20 text-center">Schedule Page Coming Soon</div> },
      { path: 'modes', element: <GameModes /> },
      { path: 'tournaments/:id/register', element: <Registration /> },
      { path: 'leaderboard', element: <div className="p-20 text-center">Leaderboard Page Coming Soon</div> },
      { path: 'rules', element: <div className="p-20 text-center">Rules Page Coming Soon</div> },
      { path: 'prizes', element: <div className="p-20 text-center">Prizes Page Coming Soon</div> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'dashboard', element: <Dashboard /> },
    ]
  },
  {
    path: '/admin/login',
    element: <AdminLogin />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'registrations', element: <AdminRegistrations /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'tournaments', element: <AdminTournaments /> },
      { path: 'settings', element: <div className="p-10 text-textMuted">Settings Coming Soon</div> },
    ]
  }
]);

function App() {
  const { setUser, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // Auto-create profile for legacy users
            const { setDoc, serverTimestamp } = await import('firebase/firestore');
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Player',
              fullName: firebaseUser.displayName || 'Player',
              phone: '',
              role: 'user',
              tokenBalance: 0,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile as unknown as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching/creating user profile:", error);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setProfile, setLoading]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
