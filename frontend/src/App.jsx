import React, { useState } from 'react';
import Home from './Home';
import Auth from './Auth';
import BookCatalog from './BookCatalog';
import Profile from './Profile';
import AdminDashboard from './AdminDashboard';
import './Navigation.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentView, setCurrentView] = useState('home');

  // Extract userId and roles from JWT token
  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.userId && typeof payload.userId === 'number') {
        return payload.userId;
      }
      return null;
    } catch (e) {
      console.error('Error parsing token:', e);
      return null;
    }
  };

  const getUserRolesFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles || '';
    } catch {
      return '';
    }
  };

  const userId = token ? getUserIdFromToken(token) : null;
  const userRoles = token ? getUserRolesFromToken(token) : '';
  const isAdmin = userRoles.includes('ADMIN');

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setCurrentView('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentView('home');
  };

  const renderContent = () => {
    if (currentView === 'home') {
      return <Home onNavigate={setCurrentView} token={token} />;
    }

    if (!token) {
      if (currentView === 'auth') return <Auth onLogin={handleLogin} />;
      // If trying to access protected route without token, show Auth
      if (['catalog', 'profile', 'admin'].includes(currentView)) return <Auth onLogin={handleLogin} />;
      return <Home onNavigate={setCurrentView} token={token} />;
    }

    if (currentView === 'catalog') return <BookCatalog token={token} userId={userId} />;
    if (currentView === 'profile') return <Profile token={token} userId={userId} />;
    if (currentView === 'admin') return <AdminDashboard token={token} />;

    return <Home onNavigate={setCurrentView} token={token} />;
  };

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => setCurrentView('home')} style={{ cursor: 'pointer' }}>
          <h2>Library System</h2>
          {token && <span style={{ fontSize: '12px', color: '#a0aec0', marginLeft: '10px' }}>Role: {userRoles || 'None'}</span>}
        </div>
        <div className="nav-links">
          <button
            className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentView('home')}
          >
            Home
          </button>
          <button
            className={`nav-btn ${currentView === 'catalog' ? 'active' : ''}`}
            onClick={() => setCurrentView('catalog')}
          >
            Browse Books
          </button>
          {token && (
            <button
              className={`nav-btn ${currentView === 'profile' ? 'active' : ''}`}
              onClick={() => setCurrentView('profile')}
            >
              My Books
            </button>
          )}
          {isAdmin && (
            <button
              className={`nav-btn ${currentView === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentView('admin')}
            >
              Admin Panel
            </button>
          )}

          {token ? (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          ) : (
            <button className="nav-btn" onClick={() => setCurrentView('auth')}>Login</button>
          )}
        </div>
      </nav>

      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
