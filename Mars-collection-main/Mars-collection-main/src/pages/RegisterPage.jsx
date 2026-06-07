import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill in all details', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      showToast('Account registered successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Registration failed. Email might already be taken.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-30 text-left">
      <div className="bg-white dark:bg-luxury-charcoal p-8 border border-gray-200 dark:border-luxury-border shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl tracking-wide">Create Account</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-light">
            Become a registered MARS member
          </p>
        </div>

        <form onSubmit={handleSubmitRegister} className="space-y-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Full Name</label>
            <div className="relative flex items-center border border-gray-200 dark:border-luxury-border px-3 py-2.5">
              <User size={14} className="text-gray-400 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

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
            <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Password</label>
            <div className="relative flex items-center border border-gray-200 dark:border-luxury-border px-3 py-2.5">
              <Lock size={14} className="text-gray-400 mr-2.5 flex-shrink-0" />
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Confirm Password</label>
            <div className="relative flex items-center border border-gray-200 dark:border-luxury-border px-3 py-2.5">
              <Lock size={14} className="text-gray-400 mr-2.5 flex-shrink-0" />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Registering Account...' : 'Create Account'} <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100 dark:border-luxury-border text-[10px] uppercase tracking-widest text-gray-400 font-light">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-luxury-charcoal dark:text-white hover:text-gold underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
