import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/useAuthStore';
import { registerTeamForTournament, checkRegistrationStatus } from '../firebase/tournament';
import { motion } from 'framer-motion';
import { ShieldAlert, Loader2, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const ENTRY_FEE = 40;
const TOURNAMENT_ID = 'main-ff-arena-season-1';

const playerSchema = z.object({
  name: z.string().min(2, { message: "Player name is required" }),
  uid: z.string().min(5, { message: "Valid Free Fire UID required" }),
});

const registrationSchema = z.object({
  teamName: z.string().min(3, { message: "Team name must be at least 3 characters" }),
  captainName: z.string().min(2, { message: "Captain name is required" }),
  captainUid: z.string().min(5, { message: "Valid Free Fire UID required" }),
  whatsapp: z.string().min(10, { message: "Valid WhatsApp number required" }),
  email: z.string().email({ message: "Invalid email address" }),
  players: z.array(playerSchema).length(3, { message: "Exactly 3 additional players required" }),
  agreement: z.literal(true, {
    errorMap: () => ({ message: "You must accept the rules" }),
  }),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const Tournament = () => {
  const { user, profile } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (user) {
        const registered = await checkRegistrationStatus(user.uid, TOURNAMENT_ID);
        setIsRegistered(registered);
      } else {
        setIsRegistered(false);
      }
      setIsCheckingRegistration(false);
    };
    checkStatus();
  }, [user]);

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      players: [ { name: '', uid: '' }, { name: '', uid: '' }, { name: '', uid: '' } ]
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "players",
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    setError(null);

    // Validate unique UIDs across the team
    const allUids = [data.captainUid.trim(), ...data.players.map(p => p.uid.trim())];
    const uniqueUids = new Set(allUids);
    if (uniqueUids.size !== allUids.length) {
      setError("Duplicate UIDs detected! All 4 team members must have unique Free Fire UIDs.");
      return;
    }

    if (!user || !profile) {
      setError("You must be logged in to register.");
      return;
    }

    if (profile.tokenBalance < ENTRY_FEE) {
      setError("Insufficient Tokens. Please buy more tokens to register.");
      return;
    }

    try {
      await registerTeamForTournament(user.uid, TOURNAMENT_ID, ENTRY_FEE, {
        teamName: data.teamName,
        captainName: data.captainName,
        captainUid: data.captainUid,
        players: data.players,
        whatsapp: data.whatsapp,
        email: data.email,
      });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to register team. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 inline-block border border-primary/50 bg-primary/10 px-4 py-1 text-primary text-xs font-bold tracking-widest uppercase"
          >
            REGISTRATION OPEN
          </motion.div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-wider mb-4">
            SEASON 1 <span className="text-primary">CHAMPIONSHIP</span>
          </h1>
          <p className="text-textMuted max-w-2xl mx-auto">
            Register your squad for the upcoming tournament. Make sure you have all player UIDs ready.
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
              {success ? "TEAM REGISTERED SUCCESSFULLY" : "ALREADY REGISTERED"}
            </h2>
            <p className="text-textMuted mb-10 max-w-lg mx-auto relative z-10 text-lg">
              {success 
                ? "Your registration is pending admin approval. Prepare your squad for the upcoming battles." 
                : "Your squad is already registered for this tournament. Check your dashboard for the latest updates."}
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
              <span className="text-white/70 text-xs">(10 PER PLAYER)</span>
            </div>

            <h3 className="font-display text-3xl font-bold text-white mb-8 mt-4 md:mt-0 border-b border-gray-800 pb-4">SQUAD DETAILS</h3>

            {!user ? (
              <div className="p-6 bg-red-500/10 border border-red-500/30 text-center mb-8">
                <ShieldAlert className="mx-auto text-primary mb-2" size={32} />
                <p className="text-white mb-4">You must be logged in to register a team.</p>
                <Link to="/login" className="inline-block px-6 py-2 bg-primary text-white font-bold text-sm tracking-widest">
                  LOGIN NOW
                </Link>
              </div>
            ) : null}

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 flex items-start gap-3 text-red-500">
                <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-bold block mb-1">REGISTRATION FAILED</span>
                  <span className="text-sm">{error}</span>
                  {error.includes('Tokens') && (
                    <Link to="/dashboard" className="block mt-2 text-xs underline font-bold">BUY TOKENS IN DASHBOARD</Link>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className={!user ? 'opacity-50 pointer-events-none' : ''}>
              
              {/* Team Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">TEAM NAME</label>
                  <input {...register('teamName')} className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary" />
                  {errors.teamName && <p className="text-primary text-xs mt-1">{errors.teamName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">TEAM LOGO URL (OPTIONAL)</label>
                  <input type="text" className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary opacity-50" placeholder="https://" disabled />
                </div>
              </div>

              {/* Captain Info */}
              <h4 className="font-display text-xl text-white mb-4">CAPTAIN DETAILS</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-black/20 p-6 border border-gray-800">
                <div>
                  <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">CAPTAIN IN-GAME NAME</label>
                  <input {...register('captainName')} className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary" />
                  {errors.captainName && <p className="text-primary text-xs mt-1">{errors.captainName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">CAPTAIN FF UID</label>
                  <input {...register('captainUid')} className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary" />
                  {errors.captainUid && <p className="text-primary text-xs mt-1">{errors.captainUid.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">WHATSAPP NUMBER</label>
                  <input {...register('whatsapp')} className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary" />
                  {errors.whatsapp && <p className="text-primary text-xs mt-1">{errors.whatsapp.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">EMAIL ADDRESS</label>
                  <input {...register('email')} className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary" />
                  {errors.email && <p className="text-primary text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              {/* Players Info */}
              <h4 className="font-display text-xl text-white mb-4">SQUAD MEMBERS</h4>
              <div className="space-y-4 mb-8">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 p-4 border border-gray-800">
                    <div>
                      <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">PLAYER {index + 1} IGN</label>
                      <input {...register(`players.${index}.name` as const)} className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary" />
                      {errors.players?.[index]?.name && <p className="text-primary text-xs mt-1">{errors.players[index]?.name?.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-textMuted mb-2 tracking-widest">PLAYER {index + 1} UID</label>
                      <input {...register(`players.${index}.uid` as const)} className="w-full bg-background border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-primary" />
                      {errors.players?.[index]?.uid && <p className="text-primary text-xs mt-1">{errors.players[index]?.uid?.message}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-8 p-4 border border-gray-800 bg-black/40">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...register('agreement')} className="mt-1 w-4 h-4 accent-primary" />
                  <div>
                    <span className="text-sm text-gray-300 block mb-1">I agree to the tournament rules and confirm that all provided details are correct.</span>
                    <span className="text-xs text-primary font-bold">Registration fee of {ENTRY_FEE} Tokens (10 per player) will be deducted from your account.</span>
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
                      <span>CONFIRM REGISTRATION</span>
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

export default Tournament;
