import MeditationTimer from '../features/MeditationTimer';
import AstroJournal from '../features/AstroJournal';
import UniverseExplorer from '../features/UniverseExplorer';
import RandomCosmicGenerator from '../features/RandomCosmicGenerator';
import DreamInterpreter from '../features/DreamInterpreter';
import CosmicSignals from '../features/CosmicSignals';

const FeatureGrid = () => {
  return (
    <section className="my-16">
      <h2 className="text-2xl font-space font-bold text-center mb-10">Explore Cosmic Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <MeditationTimer />
        <AstroJournal />
        <UniverseExplorer />
        <RandomCosmicGenerator />
        <DreamInterpreter />
        <CosmicSignals />
      </div>
    </section>
  );
};

export default FeatureGrid;
