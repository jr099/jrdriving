import { Menu, X, Truck, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { AppPage } from '../lib/navigation';

type NavbarProps = {
  currentPage: AppPage;
  onNavigate: (page: string) => void;
};

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = user
    ? profile?.role === 'admin'
      ? [
          { name: 'Accueil', page: 'home' },
          { name: 'Services', page: 'services' },
          { name: 'Suivi mission', page: 'tracking' },
          { name: 'Administration', page: 'admin' },
          { name: 'Contact', page: 'contact' },
        ]
      : profile?.role === 'driver'
      ? [
          { name: 'Accueil', page: 'home' },
          { name: 'Mes Missions', page: 'driver' },
          { name: 'Suivi mission', page: 'tracking' },
          { name: 'Contact', page: 'contact' },
        ]
      : [
          { name: 'Accueil', page: 'home' },
          { name: 'Services', page: 'services' },
          { name: 'Suivi mission', page: 'tracking' },
          { name: 'Espace client', page: 'client' },
          { name: 'Contact', page: 'contact' },
        ]
    : [
        { name: 'Accueil', page: 'home' },
        { name: 'Services', page: 'services' },
        { name: 'Suivi mission', page: 'tracking' },
        { name: 'Devenir chauffeur', page: 'recruitment' },
        { name: 'Contact', page: 'contact' },
      ];

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            type="button"
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <Truck className="h-8 w-8 text-orange-500" />
            <span className="ml-2 text-xl font-bold">jrdriving</span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`transition-colors ${
                  currentPage === item.page ? 'text-orange-500 font-semibold' : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm">{profile?.fullName}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition-colors"
              >
                Connexion
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item.page ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                {item.name}
              </button>
            ))}

            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-400">{profile?.fullName}</div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
