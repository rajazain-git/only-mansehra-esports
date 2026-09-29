import { Bell } from 'lucide-react';

export default function Notifications() {
  return (
    <div className="bg-secondary/50 border border-gray-800 p-12 text-center flex flex-col items-center animate-fade-in-up">
      <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
        <Bell size={24} className="text-gray-500" />
      </div>
      <h3 className="font-display text-2xl text-white tracking-widest mb-2">NO NEW NOTIFICATIONS</h3>
      <p className="text-textMuted max-w-sm">
        You're all caught up. We will notify you here when your registration status changes or when match rooms are created.
      </p>
    </div>
  );
}
