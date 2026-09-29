const fs = require('fs');

// 1. Update Firebase Interface
let f1 = fs.readFileSync('src/firebase/admin_tournaments.ts', 'utf8');
if (!f1.includes('prizePool?: string;')) {
  f1 = f1.replace('posterUrl?: string;', 'posterUrl?: string;\n  prizePool?: string;\n  description?: string;');
  fs.writeFileSync('src/firebase/admin_tournaments.ts', f1);
}

// 2. Update AdminTournaments UI
let f2 = fs.readFileSync('src/pages/admin/AdminTournaments.tsx', 'utf8');

if (!f2.includes('formData.prizePool')) {
  f2 = f2.replace("posterUrl: selectedTournament?.posterUrl || ''", "posterUrl: selectedTournament?.posterUrl || '',\n      prizePool: selectedTournament?.prizePool || '',\n      description: selectedTournament?.description || ''");

  f2 = f2.replace("posterUrl: finalPosterUrl,", "posterUrl: finalPosterUrl,\n      prizePool: formData.prizePool,\n      description: formData.description,");

  const inputsToAdd = `
          <div>
            <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">PRIZE POOL (e.g. PKR 5000)</label>
            <input type="text" value={formData.prizePool} onChange={e => setFormData({...formData, prizePool: e.target.value})} className="w-full bg-black/50 border border-gray-800 p-3 text-white" placeholder="Leave empty for TBA" />
          </div>
          <div>
            <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">DESCRIPTION / DETAILS</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/50 border border-gray-800 p-3 text-white h-24" placeholder="Tournament rules or description" />
          </div>
`;
  f2 = f2.replace('<div>\n            <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">POSTER IMAGE', inputsToAdd + '\n          <div>\n            <label className="block text-xs font-bold text-textMuted tracking-widest mb-2">POSTER IMAGE');
  fs.writeFileSync('src/pages/admin/AdminTournaments.tsx', f2);
}

// 3. Update FeaturedTournaments UI
let f3 = fs.readFileSync('src/components/home/FeaturedTournaments.tsx', 'utf8');
if (!f3.includes('t.prizePool')) {
  f3 = f3.replace("prizePool: 'TBA',", "prizePool: t.prizePool || 'TBA',");
  f3 = f3.replace("description: `Compete in the upcoming ${t.name} tournament.`", "description: t.description || `Compete in the upcoming ${t.name} tournament.`");
  fs.writeFileSync('src/components/home/FeaturedTournaments.tsx', f3);
}
