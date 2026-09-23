import Hero from '../components/home/Hero';
import TournamentOverview from '../components/home/TournamentOverview';
import Stats from '../components/home/Stats';
import LiveMatchPreview from '../components/home/LiveMatchPreview';
import TeamsShowcase from '../components/home/TeamsShowcase';
import SchedulePreview from '../components/home/SchedulePreview';
import PrizePool from '../components/home/PrizePool';
import RulesPreview from '../components/home/RulesPreview';
import Community from '../components/home/Community';
import FinalCTA from '../components/home/FinalCTA';

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <TournamentOverview />
      <Stats />
      <LiveMatchPreview />
      <TeamsShowcase />
      <SchedulePreview />
      <PrizePool />
      <RulesPreview />
      <Community />
      <FinalCTA />
    </div>
  );
};

export default Home;
