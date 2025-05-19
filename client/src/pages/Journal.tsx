import EnhancedJournal from '@/components/journal/EnhancedJournal';

const Journal = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-space">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Cosmic Journal
            </span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Record your cosmic thoughts, dreams, and spiritual insights. Your private space to reflect on your journey through the universe.
          </p>
        </div>
        
        <EnhancedJournal />
      </section>
    </main>
  );
};

export default Journal;
