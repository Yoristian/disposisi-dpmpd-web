import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from '../supabase';

const Login = ({ onLogin }) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('users').select('*')
        .eq('username', loginForm.username).eq('password', loginForm.password)
        .single();

      if (error || !data) {
        toast.error('Username/Password salah.');
      } else {
        onLogin({
          id_user: data.id_user, nama_lengkap: data.nama_lengkap, 
          username: data.username, role: data.role
        });
        toast.success(`Halo, ${data.nama_lengkap}!`);
      }
    } catch (err) {
      toast.error('Gagal terhubung ke server.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden"
      style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-purple-500 opacity-20 blur-[120px] pointer-events-none rounded-full"></div>

      <Toaster position="top-center" toastOptions={{ style: { borderRadius: '12px', background: '#1e1b4b', color: '#fff', fontSize: '14px' } }} />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-8 animate-fadeIn relative z-10">
        <div className="w-16 h-16 mb-6 flex items-center justify-center bg-white rounded-2xl shadow-lg shadow-purple-100/50 border border-white p-2">
            <img src="logo.png" alt="" />
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Login Sistem</h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium px-4">E-Disposisi DPMPD</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[420px] animate-fadeIn relative z-10" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white/80 backdrop-blur-xl py-10 px-6 shadow-2xl shadow-purple-200/40 sm:rounded-[2rem] border border-white sm:px-12">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold leading-6 text-gray-900 mb-2">Username</label>
              <input 
                type="text" required value={loginForm.username} 
                onChange={e => setLoginForm({...loginForm, username: e.target.value})} 
                className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm bg-gray-50/50 hover:bg-white focus:bg-white transition-all" 
                placeholder="Username..." 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold leading-6 text-gray-900 mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} required value={loginForm.password} 
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})} 
                  className="block w-full rounded-xl border-0 py-3 pl-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm bg-gray-50/50 hover:bg-white focus:bg-white transition-all" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-purple-600 z-10 bg-transparent transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" disabled={isLoginLoading || !loginForm.username || !loginForm.password} 
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-purple-600 px-3 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoginLoading ? <><Loader2 size={18} className="animate-spin" /> Memproses...</> : <><LogIn size={18} /> Masuk</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;