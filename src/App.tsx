import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tournament from './pages/Tournament';
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
  return (
    <RouterProvider router={router} />
  );
}

export default App;
