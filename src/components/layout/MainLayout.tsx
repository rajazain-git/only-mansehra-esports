import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedSkull from './AnimatedSkull';
import { ScrollRestoration } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-textMain overflow-x-hidden relative">
      <AnimatedSkull />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20"> {/* pt-20 to account for fixed navbar */}
          <Outlet />
        </main>
        <Footer />
      </div>
      <ScrollRestoration />
    </div>
  );
};

export default MainLayout;
