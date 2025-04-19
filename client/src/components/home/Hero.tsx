import { Link } from 'wouter';

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[50vh] text-center py-16 overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80" 
          alt="Galaxy background" 
          className="w-full h-full object-cover" 
          loading="lazy"
        />
      </div>
      
      <div className="z-10 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-space">
          <span className="bg-gradient-to-r from-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
            Connect with the Cosmos
          </span>
        </h1>
        <p className="text-lg md:text-xl text-[#F1F5F9] mb-8 max-w-xl mx-auto">
          Explore the universe, expand your consciousness, and discover your place in the cosmic tapestry.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/explore">
            <button className="bg-[#7E22CE] hover:bg-purple-800 text-white font-medium py-2 px-6 rounded-md shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]">
              Begin Journey
            </button>
          </Link>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center text-[#0EA5E9] hover:text-[#EC4899] transition-colors py-2 px-6"
          >
            <i className="ri-play-circle-line mr-2"></i> Watch Introduction
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
