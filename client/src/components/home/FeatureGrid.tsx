import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';

const FeatureGrid = () => {
  const features = [
    {
      title: "Cosmic Meditation",
      description: "Find your inner peace among the stars with guided meditations and ambient soundscapes.",
      icon: "mindfulness-line",
      color: "#0EA5E9",
      path: "/meditate"
    },
    {
      title: "Astro Journal",
      description: "Record your cosmic thoughts, dreams, and spiritual insights in your personal space journal.",
      icon: "book-2-line",
      color: "#EC4899",
      path: "/journal"
    },
    {
      title: "Universe Explorer",
      description: "Journey through the cosmos and discover celestial wonders from planets to distant galaxies.",
      icon: "planet-line",
      color: "#7E22CE",
      path: "/explore"
    },
    {
      title: "Cosmic Pattern Generator",
      description: "Receive a random cosmic pattern with a thought-provoking question and affirmation.",
      icon: "seedling-line",
      color: "#059669",
      path: "/tools"
    },
    {
      title: "Dream Interpreter",
      description: "Analyze your dreams through a cosmic lens to reveal their spiritual and intuitive meanings.",
      icon: "sparkling-line",
      color: "#F59E0B",
      path: "/tools"
    },
    {
      title: "Cosmic Blog",
      description: "Read inspiring articles about cosmic wisdom, spiritual growth, and connecting with the universe.",
      icon: "article-line",
      color: "#8B5CF6",
      path: "/blog"
    }
  ];

  return (
    <section className="space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-space tracking-tight text-[#F8FAFC]">
          Explore Cosmic Tools
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {features.map((feature, index) => (
          <Link key={index} href={feature.path}>
            <Card className="bg-white/[0.02] border border-white/[0.08] hover:border-white/20 rounded-2xl backdrop-blur-md shadow-none transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full group">
              <CardContent className="p-6 sm:p-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/[0.08] group-hover:border-white/20 transition-colors">
                      <i className={`ri-${feature.icon} text-lg text-slate-200`}></i>
                    </div>
                    <h3 className="ml-3.5 text-lg font-medium font-space text-[#F8FAFC] group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-6 flex justify-end">
                  <span className="text-xs font-mono text-[#94A3B8] group-hover:text-white flex items-center transition-colors">
                    Explore <i className="ri-arrow-right-line ml-1.5 transition-transform group-hover:translate-x-0.5"></i>
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;
