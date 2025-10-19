import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Services from './pages/Services';
import Quote from './pages/Quote';
import Contact from './pages/Contact';
import Login from './pages/Login';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Legal from './pages/Legal';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, profile, loading } = useAuth();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (currentPage === 'driver' && user && profile?.role === 'driver') {
      return <DriverDashboard />;
    }

    if (currentPage === 'admin' && user && profile?.role === 'admin') {
      return <AdminDashboard />;
    }

    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'services':
        return <Services onNavigate={handleNavigate} />;
      case 'quote':
        return <Quote onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'legal':
        return <Legal />;
      case 'terms':
        return <Terms />;
      case 'privacy':
        return <Privacy />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
      <ChatBot />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
