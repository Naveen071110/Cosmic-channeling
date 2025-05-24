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
      </div>
    </section>
  );
};

export default Hero;
