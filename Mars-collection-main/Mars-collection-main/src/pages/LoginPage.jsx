import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/dashboard';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all credentials', 'warning');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Signed in successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-36 text-left">
      <div className="bg-white dark:bg-luxury-charcoal p-8 border border-gray-200 dark:border-luxury-border shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl tracking-wide">Sign In</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-light">
            Welcome back to the MARS Atelier
          </p>
        </div>

        <form onSubmit={handleSubmitLogin} className="space-y-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Email Address</label>
            <div className="relative flex items-center border border-gray-200 dark:border-luxury-border px-3 py-2.5">
              <Mail size={14} className="text-gray-400 mr-2.5 flex-shrink-0" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-baseline">
              <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Password</label>
              <Link to="/forgot-password" className="text-[9px] uppercase tracking-widest hover:text-gold text-gray-400">
                Forgot?
              </Link>
            </div>
            <div className="relative flex items-center border border-gray-200 dark:border-luxury-border px-3 py-2.5">
              <Lock size={14} className="text-gray-400 mr-2.5 flex-shrink-0" />
              <input
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-4 text-center mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying Account...' : 'Sign In'} <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100 dark:border-luxury-border text-[10px] uppercase tracking-widest text-gray-400 font-light">
          New client?{' '}
          <Link to="/register" className="font-semibold text-luxury-charcoal dark:text-white hover:text-gold underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
