import type { ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
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
import NotFound from './pages/NotFound';
import ClientDashboard from './pages/ClientDashboard';
import Tracking from './pages/Tracking';
import Recruitment from './pages/Recruitment';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { requireRole } from './lib/auth';
import { usePageNavigation } from './hooks/usePageNavigation';
import { createRedirect } from './lib/redirect';

function withNavigation<P extends { onNavigate: (page: string) => void }>(Component: ComponentType<P>) {
  return function ComponentWithNavigation(props: Omit<P, 'onNavigate'>) {
    const handleNavigate = usePageNavigation();
    return <Component {...(props as P)} onNavigate={handleNavigate} />;
  };
}

const HomeRoute = withNavigation(Home);
const ServicesRoute = withNavigation(Services);
const QuoteRoute = withNavigation(Quote);
const LoginRoute = withNavigation(Login);
const TrackingRoute = withNavigation(Tracking);
const RecruitmentRoute = withNavigation(Recruitment);
const ForgotPasswordRoute = withNavigation(ForgotPassword);
const ResetPasswordRoute = withNavigation(ResetPassword);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomeRoute /> },
      { path: 'services', element: <ServicesRoute /> },
      { path: 'devis', element: <QuoteRoute /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <LoginRoute /> },
      { path: 'suivi-mission', element: <TrackingRoute /> },
      { path: 'recrutement-chauffeurs', element: <RecruitmentRoute /> },
      { path: 'mot-de-passe-oublie', element: <ForgotPasswordRoute /> },
      { path: 'reinitialiser-mot-de-passe', element: <ResetPasswordRoute /> },
      {
        path: 'client',
        loader: ({ request }) => requireRole(request, 'client'),
        element: <ClientDashboard />,
      },
      {
        path: 'chauffeur',
        loader: ({ request }) => requireRole(request, 'driver'),
        element: <DriverDashboard />,
      },
      {
        path: 'admin',
        loader: ({ request }) => requireRole(request, 'admin'),
        element: <AdminDashboard />,
      },
      { path: 'mentions-legales', element: <Legal /> },
      { path: 'mentions', loader: () => createRedirect('/mentions-legales') },
      { path: 'conditions-generales', element: <Terms /> },
      { path: 'politique-confidentialite', element: <Privacy /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
