import React, { useState, useEffect } from 'react';
import Login from './Login';
import BookList from './BookList';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="App">
      <header style={{ padding: '20px', backgroundColor: '#282c34', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Library System</h1>
        {token && <button onClick={handleLogout} style={{ padding: '5px 10px' }}>Logout</button>}
      </header>
      <main>
        {!token ? (
          <Login onLogin={handleLogin} />
        ) : (
          <BookList token={token} />
        )}
      </main>
    </div>
  );
}

export default App;
