import { useState, useEffect } from 'react';
import { isAuthenticated, removeAuthToken } from './services/api';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard'>('login');

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      if (isAuth) {
        setCurrentView('dashboard');
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    removeAuthToken();
    setCurrentView('login');
  };

  const handleViewChange = (view: 'login' | 'register' | 'dashboard') => {
    setCurrentView(view);
  };

  // Render the appropriate component based on current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'register':
        return (
          <Register 
            onViewChange={handleViewChange}
          />
        );
      case 'dashboard':
        return (
          <Dashboard />
        );
      case 'login':
      default:
        return (
          <Login 
            onLogin={handleLogin}
            onViewChange={handleViewChange}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;
