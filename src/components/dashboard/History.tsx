export default function History({ registrations, tournaments }: any) {
  const historyRegs = registrations.filter((r: any) => r.status === 'COMPLETED' || r.status === 'WINNER' || r.status === 'REJECTED' || r.status === 'CANCELLED');

  if (historyRegs.length === 0) {
    return (
      <div className="bg-secondary/50 border border-gray-800 p-12 text-center">
        <p className="text-textMuted">No registration history found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      {historyRegs.map((reg: any) => {
        const tournament = tournaments[reg.tournamentId];
        const tName = tournament ? tournament.name : 'TOURNAMENT';
        const tMode = tournament ? tournament.mode : (reg.mode || 'BATTLE ROYALE');

        return (
          <div key={reg.id} className="bg-secondary/80 border border-gray-800 p-4 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-white mb-1">{tName}</h4>
              <div className="text-xs text-textMuted">{tMode.replace('_', ' ')} • {new Date(reg.createdAt?.toDate()).toLocaleDateString()}</div>
            </div>
            <div className={`text-[10px] font-bold tracking-widest px-2 py-1 border ${
              reg.status === 'WINNER' ? 'bg-gold/10 text-gold border-gold/30' :
              reg.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
              'bg-red-500/10 text-red-500 border-red-500/30'
            }`}>
              {reg.status}
            </div>
          </div>
        );
      })}
    </div>
  );
}
