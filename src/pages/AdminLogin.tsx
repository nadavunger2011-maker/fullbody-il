import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'שגיאה בהתחברות');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Admin Login</title>
      </Helmet>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-xl font-bold text-foreground">{isSignup ? 'הרשמה' : 'כניסה לדשבורד'}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="אימייל"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
              dir="ltr"
            />
            <input
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
              dir="ltr"
            />
            {error && <p className="text-destructive text-xs text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-accent-foreground font-bold py-3 rounded-lg text-sm transition-all hover:brightness-105 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSignup ? 'הרשמה' : 'כניסה'}
            </button>
          </form>

          <button
            onClick={() => setIsSignup(!isSignup)}
            className="w-full text-center text-xs text-muted-foreground mt-4 hover:text-foreground transition"
          >
            {isSignup ? 'יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם'}
          </button>
        </div>
      </div>
    </>
  );
}
