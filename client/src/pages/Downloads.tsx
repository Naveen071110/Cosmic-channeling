import { useState } from 'react';
import { motion } from 'framer-motion';

const downloadCategories = [
  {
    id: 'all',
    label: 'All Downloads',
    icon: 'ri-download-cloud-line',
  },
  {
    id: 'audio',
    label: 'Audio',
    icon: 'ri-music-line',
    description: 'Guided meditations, ambient sounds, and affirmations',
    comingSoon: true,
  },
  {
    id: 'images',
    label: 'Wallpapers',
    icon: 'ri-image-line',
    description: 'Cosmic desktop and mobile wallpapers',
    comingSoon: true,
  },
  {
    id: 'pdfs',
    label: 'Guides & PDFs',
    icon: 'ri-file-text-line',
    description: 'Meditation guides, journal templates, and spiritual worksheets',
    comingSoon: true,
  },
  {
    id: 'printables',
    label: 'Printables',
    icon: 'ri-printer-line',
    description: 'Affirmation cards, coloring pages, and star charts',
    comingSoon: true,
  },
];

export default function Downloads() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7E22CE] to-[#EC4899] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#7E22CE]/30">
            <i className="ri-download-cloud-2-line text-4xl text-[#F8FAFC]"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-space font-bold mb-4 bg-gradient-to-r from-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
            Cosmic Downloads
          </h1>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            Download resources to deepen your cosmic journey — meditations, wallpapers, guides, and more.
          </p>
        </motion.div>
      </section>

      {/* Category Filters */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {downloadCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-[#7E22CE] text-[#F8FAFC] shadow-md shadow-[#7E22CE]/30'
                    : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#334155] hover:text-[#F1F5F9]'
                }`}
              >
                <i className={cat.icon}></i>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {activeCategory === 'all' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {downloadCategories.filter(c => c.id !== 'all').map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-[#1E293B] rounded-xl p-6 border border-[#334155] hover:border-[#7E22CE]/50 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#7E22CE]/20 to-[#EC4899]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <i className={`${cat.icon} text-2xl text-[#EC4899]`}></i>
                  </div>
                  <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2">{cat.label}</h3>
                  <p className="text-sm text-[#64748B] mb-4">{cat.description}</p>
                  {cat.comingSoon ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#334155] text-[#94A3B8]">
                      <i className="ri-time-line"></i>
                      Coming Soon
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#7E22CE]/20 text-[#7E22CE]">
                      <i className="ri-download-line"></i>
                      Available Now
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-[#1E293B] flex items-center justify-center mx-auto mb-6">
                <i className="ri-construction-line text-4xl text-[#64748B]"></i>
              </div>
              <h3 className="text-xl font-semibold text-[#F1F5F9] mb-3">Content Coming Soon</h3>
              <p className="text-[#64748B] max-w-md mx-auto">
                We're creating cosmic resources for this category. Sign up for the newsletter to be notified when downloads are available.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl p-10 border border-[#334155]">
          <h2 className="text-2xl font-space font-bold text-[#F1F5F9] mb-3">
            Get Notified When New Downloads Arrive
          </h2>
          <p className="text-[#64748B] mb-6">
            Subscribe to our newsletter and be the first to know about new cosmic content and downloads.
          </p>
          <a
            href="/#newsletter"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-[#7E22CE] to-[#EC4899] text-[#F8FAFC] font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            <i className="ri-mail-line"></i>
            Subscribe to Newsletter
          </a>
        </div>
      </section>
    </div>
  );
}
