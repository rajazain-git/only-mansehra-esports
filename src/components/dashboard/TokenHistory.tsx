import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TokenHistory({ transactions }: any) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-secondary/50 border border-gray-800 p-12 text-center">
        <p className="text-textMuted">No token transactions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in-up">
      {transactions.map((tx: any) => {
        const isCredit = tx.amount > 0;
        return (
          <div key={tx.id} className="bg-secondary/80 border border-gray-800 p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${isCredit ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {isCredit ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{tx.description || tx.type}</div>
                <div className="text-xs text-textMuted">{tx.createdAt ? new Date(tx.createdAt.toDate()).toLocaleString() : 'Recent'}</div>
              </div>
            </div>
            <div className={`font-display text-xl font-bold ${isCredit ? 'text-green-500' : 'text-red-500'}`}>
              {isCredit ? '+' : ''}{tx.amount}
            </div>
          </div>
        );
      })}
    </div>
  );
}
