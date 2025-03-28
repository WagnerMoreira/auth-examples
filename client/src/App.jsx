import { useState, useEffect } from 'react';
import './App.css'


export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const login = async () => {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    if (res.ok) getUser();
  };

  const getUser = async () => {
    const res = await fetch('http://localhost:3000/me', {
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
  };

  const logout = async () => {
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.username}</h2>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
          <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </>
      )}
    </div>
  );
}