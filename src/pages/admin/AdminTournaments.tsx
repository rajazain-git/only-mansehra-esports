import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTournaments, createTournament, updateTournament } from '../../firebase/admin_tournaments';
import type { Tournament } from '../../firebase/admin_tournaments';
import { Plus, Edit, DoorOpen, X, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';

export default function AdminTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    const data = await getTournaments();
    setTournaments(data);
    setLoading(false);
  };

  const handleCreateTournament = () => {
    setSelectedTournament(null);
    setIsTournamentModalOpen(true);
  };

  const handleEditTournament = (t: Tournament) => {
    setSelectedTournament(t);
    setIsTournamentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-white tracking-wider">TOURNAMENTS</h2>
          <p className="text-textMuted text-sm">Manage game modes, schedules, and rooms.</p>
        </div>
        <button 
          onClick={handleCreateTournament}
          className="flex items-center gap-2 bg-primary/20 text-primary border border-primary px-4 py-2 text-sm font-bold tracking-widest hover:bg-primary hover:text-white transition-colors"
        >
          <Plus size={16} /> NEW TOURNAMENT
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-textMuted font-bold tracking-widest">LOADING...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tournaments.map(t => (
            <div key={t.id} className="bg-secondary border border-gray-800 p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-gray-800 text-textMuted px-3 py-1 text-xs font-bold tracking-widest uppercase">
                {t.mode.replace('_', ' ')}
              </div>
              
              <h3 className="font-display text-2xl font-bold text-white mb-2">{t.name}</h3>
              
              <div className="space-y-2 mb-6 text-sm text-textMuted">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-bold ${t.registrationStatus === 'OPEN' ? 'text-green-500' : 'text-red-500'}`}>
                    {t.registrationStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Entry Fee:</span>
                  <span className="text-primary font-bold">{t.entryFee} TOKENS</span>
                </div>
                {t.mode === 'BATTLE_ROYALE' && t.brOptions && (
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="text-white">
                      {t.brOptions.solo && t.brOptions.squad ? 'SOLO & SQUAD' : t.brOptions.squad ? 'SQUAD ONLY' : 'SOLO ONLY'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-t border-gray-800 pt-4">
                <button 
                  onClick={() => handleEditTournament(t)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 text-xs font-bold tracking-widest transition-colors"
                >
                  <Edit size={14} /> EDIT
                </button>
                <button 
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-primary hover:text-white text-textMuted py-2 text-xs font-bold tracking-widest transition-colors"
                >
                  <DoorOpen size={14} /> ROOMS
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isTournamentModalOpen && (
        <TournamentModal 
          tournament={selectedTournament} 
          onClose={() => setIsTournamentModalOpen(false)}
          onSave={fetchTournaments}
        />
      )}
    </div>
  );
}

function TournamentModal({ tournament, onClose, onSave }: { tournament: Tournament | null, onClose: () => void, onSave: () => void }) {
  const [formData, setFormData] = useState({
    name: tournament?.name || '',
    mode: tournament?.mode || 'BATTLE_ROYALE',
    entryFee: tournament?.entryFee || 0,
    registrationStatus: tournament?.registrationStatus || 'OPEN',
    brSolo: tournament?.brOptions?.solo ?? true,
    brSquad: tournament?.brOptions?.squad ?? true,
    maxParticipants: tournament?.maxParticipants || '',
    startDateStr: tournament?.startDate ? new Date(tournament.startDate.toDate()).toISOString().slice(0, 16) : '',
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>(tournament?.posterUrl || '');
  const [uploading, setUploading] = useState(false);

  const [saving, setSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    let finalPosterUrl = tournament?.posterUrl || null;

    if (posterFile) {
      setUploading(true);
      try {
        const storageRef = ref(storage, `tournaments/${Date.now()}_${posterFile.name}`);
        const snapshot = await uploadBytes(storageRef, posterFile);
        finalPosterUrl = await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.error("Error uploading image:", err);
        alert("Failed to upload poster image.");
        setUploading(false);
        setSaving(false);
        return;
      }
      setUploading(false);
    }

    const dataToSave: any = {
      name: formData.name,
      mode: formData.mode,
      entryFee: Number(formData.entryFee),
      registrationStatus: formData.registrationStatus,
      maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : null,
      currentParticipants: tournament?.currentParticipants || 0,
      startDate: formData.startDateStr ? Timestamp.fromDate(new Date(formData.startDateStr)) : null,
      posterUrl: finalPosterUrl,
    };

    if (formData.mode === 'BATTLE_ROYALE') {
      dataToSave.brOptions = {
        solo: formData.brSolo,
        squad: formData.brSquad,
      };
    } else {
      dataToSave.brOptions = null;
    }

    try {
      if (tournament?.id) {
        await updateTournament(tournament.id, dataToSave);
      } else {
        await createTournament(dataToSave);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving tournament');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-secondary border border-gray-800 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-secondary">
          <h3 className="font-display text-2xl font-bold text-white tracking-wider">
            {tournament ? 'EDIT TOURNAMENT' : 'NEW TOURNAMENT'}
          </h3>
          <button onClick={onClose} className="text-textMuted hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="t-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Poster Upload Section */}
            <div>
              <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">TOURNAMENT POSTER (OPTIONAL)</label>
              <div className="relative group border-2 border-dashed border-gray-700 hover:border-primary/50 transition-colors rounded-sm overflow-hidden bg-black/30 flex items-center justify-center h-48">
                {posterPreview ? (
                  <>
                    <img src={posterPreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                      <UploadCloud size={24} className="text-white mb-2" />
                      <span className="text-white text-xs font-bold tracking-widest">CHANGE POSTER</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-xs font-bold tracking-widest">CLICK TO UPLOAD</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">TOURNAMENT NAME</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none transition-colors"
                placeholder="e.g. Season 1 Championship"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">GAME MODE</label>
                <select 
                  value={formData.mode}
                  onChange={e => setFormData({...formData, mode: e.target.value as any})}
                  className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="BATTLE_ROYALE">BATTLE ROYALE</option>
                  <option value="CLASH_SQUAD">CLASH SQUAD</option>
                  <option value="LONE_WOLF">LONE WOLF</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">ENTRY FEE (TOKENS)</label>
                <input 
                  type="number" 
                  min="0"
                  value={formData.entryFee}
                  onChange={e => setFormData({...formData, entryFee: parseInt(e.target.value) || 0})}
                  className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {formData.mode === 'BATTLE_ROYALE' && (
              <div className="p-4 bg-black/30 border border-gray-800 space-y-3">
                <label className="block text-xs font-bold text-primary tracking-widest">BATTLE ROYALE OPTIONS</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.brSolo}
                      onChange={e => setFormData({...formData, brSolo: e.target.checked})}
                      className="accent-primary w-4 h-4"
                    />
                    ALLOW SOLO
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.brSquad}
                      onChange={e => setFormData({...formData, brSquad: e.target.checked})}
                      className="accent-primary w-4 h-4"
                    />
                    ALLOW SQUAD
                  </label>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">REGISTRATION STATUS</label>
                <select 
                  value={formData.registrationStatus}
                  onChange={e => setFormData({...formData, registrationStatus: e.target.value as any})}
                  className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">MAX PARTICIPANTS (OPTIONAL)</label>
                <input 
                  type="number" 
                  min="1"
                  value={formData.maxParticipants}
                  onChange={e => setFormData({...formData, maxParticipants: e.target.value})}
                  className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g. 2 for Lone Wolf"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">START DATE (OPTIONAL)</label>
              <input 
                type="datetime-local" 
                value={formData.startDateStr}
                onChange={e => setFormData({...formData, startDateStr: e.target.value})}
                className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none transition-colors"
                style={{ colorScheme: 'dark' }}
              />
            </div>

          </form>
        </div>
        
        <div className="p-6 border-t border-gray-800 bg-secondary flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold tracking-widest text-sm transition-colors"
          >
            CANCEL
          </button>
          <button 
            type="submit"
            form="t-form"
            disabled={saving || uploading}
            className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white font-bold tracking-widest text-sm transition-colors disabled:opacity-50"
          >
            {saving || uploading ? 'SAVING...' : 'SAVE TOURNAMENT'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
