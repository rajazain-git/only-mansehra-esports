import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Loader2 } from 'lucide-react';

export default function Settings() {
  const { user, profile, setProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    fullName: profile?.fullName || '',
    phone: profile?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSuccess(false);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        username: formData.username,
        fullName: formData.fullName,
        phone: formData.phone,
      });
      if (profile) {
        setProfile({ ...profile, ...formData } as any);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-secondary/50 border border-gray-800 p-8 max-w-2xl animate-fade-in-up">
      <h3 className="font-display text-3xl text-white mb-6">PROFILE SETTINGS</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">DISPLAY NAME</label>
          <input 
            type="text" 
            value={formData.username}
            onChange={e => setFormData({...formData, username: e.target.value})}
            className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none"
            required
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">FULL NAME</label>
          <input 
            type="text" 
            value={formData.fullName}
            onChange={e => setFormData({...formData, fullName: e.target.value})}
            className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">WHATSAPP NUMBER</label>
          <input 
            type="text" 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:border-primary focus:outline-none"
            required
          />
        </div>

        <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
          {success ? (
            <span className="text-green-500 font-bold text-sm tracking-widest">SAVED SUCCESSFULLY</span>
          ) : <span />}
          
          <button 
            type="submit" 
            disabled={saving}
            className="bg-primary text-white font-bold tracking-widest px-8 py-3 hover:bg-white hover:text-primary transition-colors disabled:opacity-50 flex items-center gap-2 skew-x-[-10deg]"
          >
            <div className="skew-x-[10deg]">
              {saving ? <Loader2 size={16} className="animate-spin" /> : 'SAVE CHANGES'}
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
