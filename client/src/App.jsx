import { useState } from "react";
import useAuth from "./hooks/useAuth";

import "./App.css";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { user, login, logout, getUser } = useAuth();

  const handleLogin = () => {
    login(username, password);
  };

  return (
    <div style={{ padding: 20 }}>
      {user ? (
        <>
          <h2>Welcome, {user.username}</h2>
          <button onClick={logout}>Logout</button>
          <button onClick={getUser}>
            Test /me (15s after login, as the accessToken will have expired)
          </button>
        </>
      ) : (
        <>
          <input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </>
      )}
    </div>
  );
}
