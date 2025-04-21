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
    }
  ];

  return (
    <section className="my-16">
      <h2 className="text-2xl font-space font-bold text-center mb-10">Explore Cosmic Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Link key={index} href={feature.path}>
            <Card className="bg-[#1E293B] border-[#334155] shadow-lg hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all hover:border-[#7E22CE]/40 cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${feature.color}20` }}>
                    <i className={`ri-${feature.icon} text-xl`} style={{ color: feature.color }}></i>
                  </div>
                  <h3 className="ml-3 text-lg font-medium">{feature.title}</h3>
                </div>
                <p className="text-sm text-[#94A3B8]">{feature.description}</p>
                <div className="mt-4 flex justify-end">
                  <span className="text-xs flex items-center" style={{ color: feature.color }}>
                    Explore <i className="ri-arrow-right-line ml-1"></i>
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
