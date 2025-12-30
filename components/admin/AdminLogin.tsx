import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo credentials
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('triglav_admin_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-black to-black"></div>
      
      <div className="max-w-md w-full bg-gray-900 border border-amber-900/30 p-8 rounded-lg shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center rounded-full mx-auto mb-4 border-2 border-amber-500 shadow-lg shadow-amber-600/20">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-amber-500 uppercase tracking-widest">
            Admin Panel
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-bold tracking-wide">TRIGLAV ONLINE MANAGEMENT</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 text-red-400 p-3 text-sm text-center border border-red-900/50 rounded font-bold">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-gray-500 text-xs uppercase font-black mb-2 tracking-wider">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-gray-800 text-white pl-10 pr-4 py-3 focus:outline-none focus:border-amber-600 transition rounded"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-500 text-xs uppercase font-black mb-2 tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-800 text-white pl-10 pr-4 py-3 focus:outline-none focus:border-amber-600 transition rounded"
                placeholder="•••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3 uppercase tracking-wider transition rounded shadow-lg"
          >
            Войти
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-gray-800 pt-6">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-white text-xs uppercase font-bold tracking-wider flex items-center justify-center w-full"
          >
            <ArrowLeft size={14} className="mr-2" />
            Вернуться на сайт
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;