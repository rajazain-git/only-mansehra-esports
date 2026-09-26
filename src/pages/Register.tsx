import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '../firebase/auth';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';

import { BeamsBackground } from '../components/ui/beams-background';

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Full Name is required" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Valid WhatsApp number is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, setUser, setProfile } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    try {
      const { user, profile } = await registerUser(data.email, data.password, data.fullName, data.username, data.phone);
      setUser(user);
      setProfile(profile);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else {
        setError(err.message || 'Failed to register. Please try again.');
      }
    }
  };

  return (
    <BeamsBackground intensity="subtle" className="min-h-[calc(100vh-80px)] py-20 px-4">

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-secondary/80 backdrop-blur-md border border-gray-800 p-8 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="font-display text-4xl font-bold text-white tracking-wider">CREATE ACCOUNT</h2>
          <p className="text-textMuted text-sm">Join the Battle Arena</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 flex items-start gap-3 text-red-500">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">FULL NAME</label>
              <input 
                {...register('fullName')}
                type="text" 
                className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
              {errors.fullName && <p className="text-primary text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">USERNAME</label>
              <input 
                {...register('username')}
                type="text" 
                className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
              {errors.username && <p className="text-primary text-xs mt-1">{errors.username.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">EMAIL ADDRESS</label>
            <input 
              {...register('email')}
              type="email" 
              className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            />
            {errors.email && <p className="text-primary text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">WHATSAPP NUMBER</label>
            <input 
              {...register('phone')}
              type="text" 
              className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="+92 XXX XXXXXXX"
            />
            {errors.phone && <p className="text-primary text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">PASSWORD</label>
              <input 
                {...register('password')}
                type="password" 
                className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
              {errors.password && <p className="text-primary text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">CONFIRM PASSWORD</label>
              <input 
                {...register('confirmPassword')}
                type="password" 
                className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
              {errors.confirmPassword && <p className="text-primary text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-4 py-4 bg-primary text-white font-bold tracking-widest skew-x-[-10deg] hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <div className="skew-x-[10deg] flex items-center gap-2">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'COMPLETE REGISTRATION'}
            </div>
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-textMuted border-t border-gray-800 pt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            LOGIN HERE
          </Link>
        </div>
      </motion.div>
    </BeamsBackground>
  );
};

export default Register;
