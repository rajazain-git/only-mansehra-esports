import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from '../../firebase/auth';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';
import { ShieldAlert, Loader2, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const { setUser, setProfile } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError('');
    try {
      const { user, profile } = await loginUser(data.email, data.password);
      setUser(user);
      setProfile(profile);
      
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        setAuthError('Access denied. You do not have administrator privileges.');
        // Log them out if they are not admin but tried to login via admin portal
        setUser(null);
        setProfile(null);
      }
    } catch (error: any) {
      setAuthError(error.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[150px] pointer-events-none rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-accent/20 text-accent flex items-center justify-center rounded-full mb-4 border border-accent/50">
            <Lock size={24} />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-wider">ADMIN <span className="text-accent">PORTAL</span></h1>
          <p className="text-textMuted text-sm mt-2 font-bold tracking-widest">AUTHORIZED PERSONNEL ONLY</p>
        </div>

        {authError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 flex items-start gap-3 text-red-500">
            <ShieldAlert size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-bold">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">ADMIN EMAIL</label>
            <input 
              {...register('email')}
              type="email" 
              className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
              placeholder="admin@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">PASSWORD</label>
            <input 
              {...register('password')}
              type="password" 
              className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent/80 text-white font-bold py-4 tracking-widest transition-colors flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'AUTHENTICATE'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
