import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from '../firebase/auth';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, setUser, setProfile } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const { user, profile } = await loginUser(data.email, data.password);
      setUser(user);
      setProfile(profile);
      navigate('/dashboard');
    } catch (err: any) {
      // Firebase throws errors, we catch and display
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Failed to login. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-secondary border border-gray-800 p-8 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="font-display text-4xl font-bold text-white tracking-wider">LOGIN</h2>
          <p className="text-textMuted text-sm">Welcome back to the Arena</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 flex items-start gap-3 text-red-500">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">EMAIL ADDRESS</label>
            <input 
              {...register('email')}
              type="email" 
              className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-primary text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">PASSWORD</label>
            <input 
              {...register('password')}
              type="password" 
              className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-primary text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-primary text-white font-bold tracking-widest skew-x-[-10deg] hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <div className="skew-x-[10deg] flex items-center gap-2">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'LOGIN TO ACCOUNT'}
            </div>
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-textMuted border-t border-gray-800 pt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            REGISTER NOW
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
