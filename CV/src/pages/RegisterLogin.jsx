import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

export default function RegisterLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/register', { email, password });
      alert('Registration successful');
    } catch (err) {
      alert('Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      setToken(response.data.token);
      alert('Login successful');
      navigate('/home')
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">CV</h1>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 mb-2 w-full" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 mb-2 w-full" />
      <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Register</button>
      <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded">Login</button>
      {token && <p className="mt-4 text-green-700">Logged in successfully!</p>}
    </div>
  );
}