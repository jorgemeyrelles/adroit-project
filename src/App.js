import React, { useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router';
import ReactGA from 'react-ga';
import { StateProvider } from './context/StateGlobal';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Report } from './pages/Report';
import { usePageViewTracker } from './service/firebase/useAnalyticsEventTracker';

export function App() {
  const location = useLocation();

  useEffect(() => {
    const username = JSON.parse(localStorage.getItem('user'))?.includes('@')
      ? JSON.parse(localStorage.getItem('user')).split('@')[0] : JSON.parse(localStorage.getItem('user'));
    if (window.GA_INITIALIZED === undefined) {
      ReactGA.initialize(process.env.REACT_APP_FIREBASE_KEY, {
        gaOptions: { name: username },
      });
      window.GA_INITIALIZED = true;
    }
    usePageViewTracker(location);
  }, [location]);

  return (
    <StateProvider>
      <Routes>
        <Route exact path="/" element={<Navigate to="/login" replace />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/report/:id" element={<Report />} />
      </Routes>
    </StateProvider>
  );
}
