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
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLogin from './pages/admin/AdminLogin';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'tournament', element: <Tournament /> },
      { path: 'solo-tournament', element: <SoloTournament /> },
      { path: 'schedule', element: <div className="p-20 text-center">Schedule Page Coming Soon</div> },
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
      { path: 'users', element: <AdminUsers /> },
      { path: 'tournaments', element: <div className="p-10 text-textMuted">Tournaments Management Coming Soon</div> },
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
            setProfile(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
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
