import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ForgotPasswordPage = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitForgot = (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmitted(true);
    showToast('Mock: Password reset link dispatched to email', 'success');
  };

  return (
    <div className="max-w-md mx-auto px-6 py-36 text-left">
      <div className="bg-white dark:bg-luxury-charcoal p-8 border border-gray-200 dark:border-luxury-border shadow-xl space-y-6">
        <div className="space-y-2">
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-luxury-charcoal dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={12} /> Back to Sign In
          </Link>
          <h1 className="font-serif text-3xl tracking-wide pt-2 text-center">Reset Password</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-light text-center">
            Recover access to your luxury locker
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
              <Send size={20} />
            </div>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              If the address <strong className="text-luxury-charcoal dark:text-white">{email}</strong> matches a MARS record, a password reset invoice will arrive shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-outline w-full py-3 text-center"
            >
              Enter Another Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitForgot} className="space-y-4 text-xs">
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

            <button
              type="submit"
              className="btn-gold w-full py-4 text-center mt-2 flex items-center justify-center gap-2"
            >
              Submit Reset Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
