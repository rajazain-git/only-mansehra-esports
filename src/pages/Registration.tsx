import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthStore } from '../store/useAuthStore';
import { checkRegistrationStatus, registerPlayerOrTeam } from '../firebase/tournament';
import type { Tournament } from '../firebase/admin_tournaments';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ShieldAlert, Trophy } from 'lucide-react';

const soloSchema = z.object({
  playerName: z.string().min(2, "Player name is required"),
  gameUid: z.string().min(5, "Valid Game UID required"),
  email: z.string().email("Invalid email"),
  whatsapp: z.string().min(10, "Valid WhatsApp required"),
  agreement: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) })
});

const squadSchema = z.object({
  teamName: z.string().min(2, "Team name is required"),
  captainName: z.string().min(2, "Captain name is required"),
  captainUid: z.string().min(5, "Valid Game UID required"),
  player2Name: z.string().min(2, "Required"),
  player2Uid: z.string().min(5, "Required"),
  player3Name: z.string().min(2, "Required"),
  player3Uid: z.string().min(5, "Required"),
  player4Name: z.string().min(2, "Required"),
  player4Uid: z.string().min(5, "Required"),
  email: z.string().email("Invalid email"),
  whatsapp: z.string().min(10, "Valid WhatsApp required"),
  agreement: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) })
});

export default function Registration() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuthStore();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [tLoading, setTLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCheckingReg, setIsCheckingReg] = useState(true);
  
  const [registrationType, setRegistrationType] = useState<'SOLO' | 'SQUAD' | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'tournaments', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Tournament;
          setTournament(data);
          
          if (data.brOptions) {
             if (data.brOptions.solo && !data.brOptions.squad) setRegistrationType('SOLO');
             if (!data.brOptions.solo && data.brOptions.squad) setRegistrationType('SQUAD');
             // If both, let user pick (registrationType remains null)
          } else {
             // Fallback for older tournaments created without these options
             if (data.mode === 'LONE_WOLF') setRegistrationType('SOLO');
             if (data.mode === 'CLASH_SQUAD') setRegistrationType('SQUAD');
          }
        } else {
          setError("Tournament not found");
        }
      } catch (err) {
        setError("Failed to load tournament details");
      }
      setTLoading(false);
    };
    fetchTournament();
  }, [id]);

  useEffect(() => {
    const checkReg = async () => {
      if (user && id) {
        const registered = await checkRegistrationStatus(user.uid, id);
        setIsRegistered(registered);
      }
      setIsCheckingReg(false);
    };
    checkReg();
  }, [user, id]);

  const { register: registerSolo, handleSubmit: handleSoloSubmit, formState: { errors: soloErrors, isSubmitting: isSubmittingSolo } } = useForm({
    resolver: zodResolver(soloSchema)
  });

  const { register: registerSquad, handleSubmit: handleSquadSubmit, formState: { errors: squadErrors, isSubmitting: isSubmittingSquad } } = useForm({
    resolver: zodResolver(squadSchema)
  });

  const onSubmit = async (data: any, type: 'SOLO' | 'SQUAD') => {
    setError(null);
    if (!user || !profile || !tournament || !id) return;

    if ((profile.tokenBalance || 0) < tournament.entryFee) {
      setError(`Insufficient tokens. You need ${tournament.entryFee} tokens to register.`);
      return;
    }

    try {
      let formattedData;
      if (type === 'SOLO') {
        formattedData = {
          playerName: data.playerName,
          gameUid: data.gameUid,
          email: data.email,
          whatsapp: data.whatsapp
        };
      } else {
        formattedData = {
          teamName: data.teamName,
          captainName: data.captainName,
          captainUid: data.captainUid,
          players: [
            { name: data.player2Name, uid: data.player2Uid },
            { name: data.player3Name, uid: data.player3Uid },
            { name: data.player4Name, uid: data.player4Uid }
          ],
          email: data.email,
          whatsapp: data.whatsapp
        };
      }

      await registerPlayerOrTeam(
        user.uid,
        id,
        tournament.entryFee,
        tournament.mode,
        type,
        formattedData
      );

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    }
  };

  if (loading || tLoading || isCheckingReg) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#060608] py-20 flex justify-center items-center">
        <div className="flex flex-col items-center justify-center">
          <Loader2 size={40} className="text-primary animate-spin mb-4" />
          <p className="text-white font-bold tracking-widest text-sm">LOADING DETAILS...</p>
        </div>
      </div>
    );
  }

  if (error && !tournament) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#060608] py-20 flex justify-center items-center">
        <div className="bg-secondary border border-gray-800 p-12 text-center max-w-md w-full z-10">
          <ShieldAlert size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-white font-bold tracking-widest mb-2">ERROR</h2>
          <p className="text-textMuted">{error}</p>
        </div>
      </div>
    );
  }

  if (success || isRegistered) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#060608] py-20 flex justify-center items-center">
        <div 
          className="bg-[#0B0B0F]/80 backdrop-blur-md border border-primary/30 p-12 text-center relative overflow-hidden z-10 max-w-2xl w-full mx-4 animate-fade-in-up"
        >
          <div className="w-24 h-24 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10">
            <Trophy size={40} className="text-primary" />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4 relative z-10">
            {success ? "REGISTERED SUCCESSFULLY" : "ALREADY REGISTERED"}
          </h2>
          <p className="text-textMuted mb-10 mx-auto relative z-10 text-lg">
            {success 
              ? "Your registration is pending admin approval. Prepare for the upcoming battles." 
              : "You are already registered for this tournament. Check your dashboard for the latest updates."}
          </p>
          <Link 
            to="/dashboard" 
            className="group relative inline-flex px-10 py-4 bg-primary text-white font-bold tracking-widest overflow-hidden shadow-[0_0_20px_rgba(224,0,42,0.4)] hover:shadow-[0_0_30px_rgba(224,0,42,0.7)] transition-all skew-x-[-15deg] z-10"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
            <div className="skew-x-[15deg]">GO TO DASHBOARD</div>
          </Link>
        </div>
      </div>
    );
  }

  if (tournament?.registrationStatus === 'CLOSED') {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#060608] py-20 flex justify-center items-center">
        <div className="bg-[#0B0B0F] border border-red-900/50 p-12 text-center max-w-lg w-full shadow-[0_0_50px_rgba(220,38,38,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-red-600/50" />
          <ShieldAlert size={50} className="text-red-600 mx-auto mb-6 opacity-80" />
          <h2 className="font-display text-4xl font-bold text-red-500 tracking-[0.2em] mb-4">SLOTS FULL</h2>
          <p className="text-gray-400 font-light tracking-wide text-lg">
            This tournament has reached its maximum capacity. Keep an eye on the Game Modes section for future battlefields.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#060608] py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] max-w-[800px] bg-[radial-gradient(ellipse_at_top,_rgba(224,0,42,0.1),_transparent_70%)] pointer-events-none" />
      <div className="container mx-auto max-w-2xl relative z-10">
        
        <div className="text-center mb-12">
          <div
            className="mb-4 inline-block border border-primary/50 bg-primary/10 px-4 py-1 text-primary text-xs font-bold tracking-widest uppercase animate-fade-in"
          >
            {tournament?.mode.replace('_', ' ')} REGISTRATION
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-wider mb-4 uppercase">
            {tournament?.name}
          </h1>
          <p className="text-textMuted max-w-xl mx-auto">
            Fill in your details below to secure your spot in the arena. Entry Fee: {tournament?.entryFee} Tokens.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 mb-8 flex items-center gap-3">
            <ShieldAlert className="text-red-500" />
            <p className="text-red-500 text-sm font-bold tracking-widest">{error}</p>
          </div>
        )}

        <div 
          className="bg-[#0B0B0F]/95 border border-primary/20 shadow-xl p-6 md:p-10 relative overflow-hidden animate-fade-in-up"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[50px] rounded-full pointer-events-none -mr-40 -mt-40" />
          {/* Pick type if tournament allows both */}
          {!registrationType && (
            <div className="text-center py-8">
              <h3 className="text-white font-bold tracking-widest mb-6">SELECT REGISTRATION FORMAT</h3>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setRegistrationType('SOLO')}
                  className="px-8 py-4 bg-gray-800 hover:bg-primary text-white transition-colors font-bold tracking-widest"
                >
                  SOLO
                </button>
                <button 
                  onClick={() => setRegistrationType('SQUAD')}
                  className="px-8 py-4 bg-gray-800 hover:bg-primary text-white transition-colors font-bold tracking-widest"
                >
                  SQUAD
                </button>
              </div>
            </div>
          )}

          {/* SOLO FORM */}
          {registrationType === 'SOLO' && (
            <form onSubmit={handleSoloSubmit((d) => onSubmit(d, 'SOLO'))} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">PLAYER NAME</label>
                  <input {...registerSolo('playerName')} className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none" />
                  {soloErrors.playerName && <p className="text-red-500 text-xs mt-1">{soloErrors.playerName.message?.toString()}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">FREE FIRE UID</label>
                  <input {...registerSolo('gameUid')} className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none" />
                  {soloErrors.gameUid && <p className="text-red-500 text-xs mt-1">{soloErrors.gameUid.message?.toString()}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">EMAIL</label>
                    <input {...registerSolo('email')} defaultValue={profile?.email} className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none" />
                    {soloErrors.email && <p className="text-red-500 text-xs mt-1">{soloErrors.email.message?.toString()}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">WHATSAPP</label>
                    <input {...registerSolo('whatsapp')} defaultValue={profile?.phone} className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none" />
                    {soloErrors.whatsapp && <p className="text-red-500 text-xs mt-1">{soloErrors.whatsapp.message?.toString()}</p>}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...registerSolo('agreement')} className="mt-1 accent-primary" />
                  <span className="text-xs text-textMuted">I confirm these details are correct and I agree to the tournament rules.</span>
                </label>
                {soloErrors.agreement && <p className="text-red-500 text-xs mt-1">{soloErrors.agreement.message?.toString()}</p>}
              </div>

              <button 
                disabled={isSubmittingSolo}
                type="submit"
                className="w-full py-4 bg-primary text-white font-bold tracking-widest transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmittingSolo ? 'PROCESSING...' : `CONFIRM REGISTRATION (-${tournament?.entryFee} TOKENS)`}
              </button>
            </form>
          )}

          {/* SQUAD FORM */}
          {registrationType === 'SQUAD' && (
            <form onSubmit={handleSquadSubmit((d) => onSubmit(d, 'SQUAD'))} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">TEAM NAME</label>
                <input {...registerSquad('teamName')} className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none" />
                {squadErrors.teamName && <p className="text-red-500 text-xs mt-1">{squadErrors.teamName.message?.toString()}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 border border-gray-800 border-l-primary">
                  <label className="block text-xs font-bold text-primary tracking-widest mb-2">CAPTAIN NAME</label>
                  <input {...registerSquad('captainName')} className="w-full bg-black/50 border border-gray-800 p-2 text-white mb-2" />
                  {squadErrors.captainName && <p className="text-red-500 text-[10px]">{squadErrors.captainName.message?.toString()}</p>}
                  
                  <label className="block text-xs font-bold text-textMuted tracking-widest mb-2 mt-3">CAPTAIN UID</label>
                  <input {...registerSquad('captainUid')} className="w-full bg-black/50 border border-gray-800 p-2 text-white" />
                  {squadErrors.captainUid && <p className="text-red-500 text-[10px]">{squadErrors.captainUid.message?.toString()}</p>}
                </div>
                <div className="bg-black/30 p-4 border border-gray-800 border-l-gray-600">
                  <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">PLAYER 2 NAME</label>
                  <input {...registerSquad('player2Name')} className="w-full bg-black/50 border border-gray-800 p-2 text-white mb-2" />
                  {squadErrors.player2Name && <p className="text-red-500 text-[10px]">{squadErrors.player2Name.message?.toString()}</p>}
                  
                  <label className="block text-xs font-bold text-textMuted tracking-widest mb-2 mt-3">PLAYER 2 UID</label>
                  <input {...registerSquad('player2Uid')} className="w-full bg-black/50 border border-gray-800 p-2 text-white" />
                  {squadErrors.player2Uid && <p className="text-red-500 text-[10px]">{squadErrors.player2Uid.message?.toString()}</p>}
                </div>
                <div className="bg-black/30 p-4 border border-gray-800 border-l-gray-600">
                  <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">PLAYER 3 NAME</label>
                  <input {...registerSquad('player3Name')} className="w-full bg-black/50 border border-gray-800 p-2 text-white mb-2" />
                  {squadErrors.player3Name && <p className="text-red-500 text-[10px]">{squadErrors.player3Name.message?.toString()}</p>}
                  
                  <label className="block text-xs font-bold text-textMuted tracking-widest mb-2 mt-3">PLAYER 3 UID</label>
                  <input {...registerSquad('player3Uid')} className="w-full bg-black/50 border border-gray-800 p-2 text-white" />
                  {squadErrors.player3Uid && <p className="text-red-500 text-[10px]">{squadErrors.player3Uid.message?.toString()}</p>}
                </div>
                <div className="bg-black/30 p-4 border border-gray-800 border-l-gray-600">
                  <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">PLAYER 4 NAME</label>
                  <input {...registerSquad('player4Name')} className="w-full bg-black/50 border border-gray-800 p-2 text-white mb-2" />
                  {squadErrors.player4Name && <p className="text-red-500 text-[10px]">{squadErrors.player4Name.message?.toString()}</p>}
                  
                  <label className="block text-xs font-bold text-textMuted tracking-widest mb-2 mt-3">PLAYER 4 UID</label>
                  <input {...registerSquad('player4Uid')} className="w-full bg-black/50 border border-gray-800 p-2 text-white" />
                  {squadErrors.player4Uid && <p className="text-red-500 text-[10px]">{squadErrors.player4Uid.message?.toString()}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">EMAIL</label>
                  <input {...registerSquad('email')} defaultValue={profile?.email} className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none" />
                  {squadErrors.email && <p className="text-red-500 text-xs mt-1">{squadErrors.email.message?.toString()}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">WHATSAPP</label>
                  <input {...registerSquad('whatsapp')} defaultValue={profile?.phone} className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none" />
                  {squadErrors.whatsapp && <p className="text-red-500 text-xs mt-1">{squadErrors.whatsapp.message?.toString()}</p>}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...registerSquad('agreement')} className="mt-1 accent-primary" />
                  <span className="text-xs text-textMuted">I confirm these details are correct and I agree to the tournament rules.</span>
                </label>
                {squadErrors.agreement && <p className="text-red-500 text-xs mt-1">{squadErrors.agreement.message?.toString()}</p>}
              </div>

              <button 
                disabled={isSubmittingSquad}
                type="submit"
                className="w-full py-4 bg-primary text-white font-bold tracking-widest transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmittingSquad ? 'PROCESSING...' : `CONFIRM SQUAD REGISTRATION (-${tournament?.entryFee} TOKENS)`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
