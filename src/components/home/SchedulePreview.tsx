import { Link } from 'react-router-dom';
import { Clock, Map } from 'lucide-react';

const SCHEDULE = [
  { id: 1, date: 'OCT 15', time: '18:00', stage: 'QUALIFIERS - GROUP A', map: 'BERMUDA', status: 'UPCOMING' },
  { id: 2, date: 'OCT 16', time: '18:00', stage: 'QUALIFIERS - GROUP B', map: 'PURGATORY', status: 'UPCOMING' },
  { id: 3, date: 'OCT 20', time: '20:00', stage: 'SEMIFINALS', map: 'KALAHARI', status: 'UPCOMING' },
  { id: 4, date: 'OCT 25', time: '21:00', stage: 'GRAND FINAL', map: 'BEST OF 5', status: 'UPCOMING' },
];

const SchedulePreview = () => {
  return (
    <section className="py-24 bg-background border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-2">TOURNAMENT <span className="text-primary">SCHEDULE</span></h2>
            <p className="text-textMuted max-w-2xl">Mark your calendars. The battle for glory begins here.</p>
          </div>
          <Link to="/schedule" className="mt-6 md:mt-0 text-sm font-bold text-accent hover:text-white transition-colors flex items-center gap-2">
            VIEW FULL SCHEDULE &rarr;
          </Link>
        </div>

        <div className="space-y-4">
          {SCHEDULE.map((match) => (
            <div 
              key={match.id} 
              className="bg-secondary border border-gray-800 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center gap-6 mb-4 md:mb-0">
                <div className="flex flex-col items-center justify-center bg-gray-900 w-16 h-16 md:w-20 md:h-20 border border-gray-800 group-hover:border-primary transition-colors">
                  <span className="font-display text-xl md:text-2xl text-white leading-none">{match.date.split(' ')[1]}</span>
                  <span className="text-[10px] text-primary font-bold">{match.date.split(' ')[0]}</span>
                </div>
                
                <div>
                  <h4 className="font-display text-2xl text-white group-hover:text-primary transition-colors">{match.stage}</h4>
                  <div className="flex items-center gap-4 text-xs text-textMuted mt-1">
                    <span className="flex items-center gap-1"><Clock size={12} /> {match.time} GMT</span>
                    <span className="flex items-center gap-1"><Map size={12} /> {match.map}</span>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-2 bg-gray-900 border border-gray-800 text-xs font-bold tracking-widest text-textMuted w-full md:w-auto text-center">
                {match.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchedulePreview;
