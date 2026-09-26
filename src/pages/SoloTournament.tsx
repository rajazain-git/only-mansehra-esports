import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/useAuthStore';
import { registerSoloPlayer, checkSoloRegistrationStatus } from '../firebase/tournament';
import { motion } from 'framer-motion';
import { ShieldAlert, Loader2, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const ENTRY_FEE = 10;
const TOURNAMENT_ID = 'solo-ff-arena-season-1';

const soloRegistrationSchema = z.object({
  playerName: z.string().min(2, { message: "Player name is required" }),
  gameUid: z.string().min(5, { message: "Valid Gaming ID / Username required" }),
  email: z.string().email({ message: "Invalid email address" }),
  whatsapp: z.string().min(10, { message: "Valid Phone Number required" }),
  gameName: z.string().min(2, { message: "Game name is required" }),
  agreement: z.literal(true, {
    errorMap: () => ({ message: "You must accept the rules" }),
  }),
});

type SoloRegistrationFormValues = z.infer<typeof soloRegistrationSchema>;

const SoloTournament = () => {
  const { user, profile } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (user) {
        const registered = await checkSoloRegistrationStatus(user.uid, TOURNAMENT_ID);
        setIsRegistered(registered);
      } else {
        setIsRegistered(false);
      }
      setIsCheckingRegistration(false);
    };
    checkStatus();
  }, [user]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SoloRegistrationFormValues>({
    resolver: zodResolver(soloRegistrationSchema),
    defaultValues: {
      gameName: 'Free Fire'
    }
  });

  const onSubmit = async (data: SoloRegistrationFormValues) => {
    setError(null);

    if (!user || !profile) {
      setError("You must be logged in to register.");
      return;
    }

    if (profile.tokenBalance < ENTRY_FEE) {
      setError("Insufficient Tokens. Please buy more tokens to register.");
      return;
    }

    try {
      await registerSoloPlayer(user.uid, TOURNAMENT_ID, ENTRY_FEE, {
        playerName: data.playerName,
        gameUid: data.gameUid,
        email: data.email,
        whatsapp: data.whatsapp,
        gameName: data.gameName,
      });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="container mx-auto max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 inline-block border border-primary/50 bg-primary/10 px-4 py-1 text-primary text-xs font-bold tracking-widest uppercase"
          >
            SOLO REGISTRATION OPEN
          </motion.div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-wider mb-4">
            SOLO <span className="text-primary">CHAMPIONSHIP</span>
          </h1>
          <p className="text-textMuted max-w-xl mx-auto">
            Register as a solo player. Fill in your details below to secure your spot in the arena.
          </p>
        </div>

        {isCheckingRegistration ? (
          <div className="bg-secondary/50 border border-gray-800 p-12 flex flex-col items-center justify-center">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <p className="text-textMuted font-bold tracking-widest text-sm">CHECKING REGISTRATION STATUS...</p>
          </div>
        ) : success || isRegistered ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0B0B0F] border border-primary/30 p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[50px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-[50px] pointer-events-none" />
            
            <div className="w-24 h-24 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10">
              <Trophy size={40} className="text-primary" />
            </div>
            <h2 className="font-display text-4xl font-bold text-white mb-4 relative z-10">
              {success ? "REGISTERED SUCCESSFULLY" : "ALREADY REGISTERED"}
            </h2>
            <p className="text-textMuted mb-10 max-w-lg mx-auto relative z-10 text-lg">
              {success 
                ? "Your registration is pending admin approval. Prepare for the upcoming battles." 
                : "You are already registered for this solo tournament. Check your dashboard for the latest updates."}
            </p>
            <Link 
              to="/dashboard" 
              className="group relative inline-flex px-10 py-4 bg-primary text-white font-bold tracking-widest overflow-hidden shadow-[0_0_20px_rgba(224,0,42,0.4)] hover:shadow-[0_0_30px_rgba(224,0,42,0.7)] transition-all skew-x-[-15deg] z-10"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
              <div className="skew-x-[15deg]">GO TO DASHBOARD</div>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary border border-gray-800 p-6 md:p-10 relative"
          >
            {/* Entry Fee Banner */}
            <div className="absolute top-0 right-0 bg-primary px-6 py-2 text-white font-bold tracking-widest text-sm shadow-[0_0_15px_rgba(224,0,42,0.5)] flex items-center gap-2">
              <span>ENTRY FEE: {ENTRY_FEE} TOKENS</span>
            </div>

            <h3 className="font-display text-3xl font-bold text-white mb-8 mt-4 md:mt-0 border-b border-gray-800 pb-4">PLAYER DETAILS</h3>

            {!user ? (
              <div className="p-6 bg-red-500/10 border border-red-500/30 text-center mb-8">
                <ShieldAlert className="mx-auto text-primary mb-2" size={32} />
                <p className="text-white mb-4">You must be logged in to register.</p>
                <Link to="/login" className="inline-block px-6 py-2 bg-primary text-white font-bold text-sm tracking-widest">
                  LOGIN NOW
                </Link>
              </div>
            ) : null}

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500 text-red-500 text-sm font-bold tracking-widest text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className={!user ? 'opacity-50 pointer-events-none' : ''}>
              
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">PLAYER NAME</label>
                  <input {...register('playerName')} className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="e.g. Ali Khan" />
                  {errors.playerName && <p className="text-primary text-xs mt-1">{errors.playerName.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">GAMING ID / USERNAME</label>
                  <input {...register('gameUid')} className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="e.g. ALIKHAN_99" />
                  {errors.gameUid && <p className="text-primary text-xs mt-1">{errors.gameUid.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">GAME NAME</label>
                  <input {...register('gameName')} className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary" />
                  {errors.gameName && <p className="text-primary text-xs mt-1">{errors.gameName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">EMAIL ADDRESS</label>
                    <input type="email" {...register('email')} className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary" />
                    {errors.email && <p className="text-primary text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">PHONE / WHATSAPP NUMBER</label>
                    <input {...register('whatsapp')} className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary" />
                    {errors.whatsapp && <p className="text-primary text-xs mt-1">{errors.whatsapp.message}</p>}
                  </div>
                </div>
              </div>

              <div className="mb-8 p-4 border border-gray-800 bg-black/40">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...register('agreement')} className="mt-1 w-4 h-4 accent-primary" />
                  <div>
                    <span className="text-sm text-gray-300 block mb-1">I agree to the tournament rules and confirm that all provided details are correct.</span>
                    <span className="text-xs text-primary font-bold">Registration fee of {ENTRY_FEE} Tokens will be deducted from your account.</span>
                    {errors.agreement && <p className="text-primary text-xs mt-1">{errors.agreement.message}</p>}
                  </div>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="group relative w-full py-5 bg-primary text-white font-bold tracking-widest text-lg overflow-hidden shadow-[0_0_20px_rgba(224,0,42,0.4)] hover:shadow-[0_0_40px_rgba(224,0,42,0.8)] transition-all skew-x-[-15deg] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[0_0_20px_rgba(224,0,42,0.4)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                <div className="skew-x-[15deg] flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      <span>PROCESSING REGISTRATION...</span>
                    </>
                  ) : (
                    <>
                      <Trophy size={20} className="text-white/80" />
                      <span>CONFIRM SOLO REGISTRATION</span>
                    </>
                  )}
                </div>
              </button>

            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SoloTournament;
