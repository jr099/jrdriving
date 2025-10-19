import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import { useAuth } from './contexts/AuthContext';
import { getPageFromPath } from './lib/navigation';
import { usePageNavigation } from './hooks/usePageNavigation';

export default function App() {
  const { loading } = useAuth();
  const location = useLocation();
  const handleNavigate = usePageNavigation();
  const currentPage = getPageFromPath(location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer onNavigate={handleNavigate} />
      <ChatBot />
    </div>
  );
}
