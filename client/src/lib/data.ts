import { Quote, CelestialObject, CosmicPattern, CosmicSound, QuizQuestion, QuizResult } from '@/types';

// Cosmic Quotes Data
export const quotes: Quote[] = [
  {
    id: "1",
    text: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",
    author: "Carl Sagan"
  },
  {
    id: "2",
    text: "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist.",
    author: "Stephen Hawking"
  },
  {
    id: "3",
    text: "We are just an advanced breed of monkeys on a minor planet of a very average star. But we can understand the Universe. That makes us something very special.",
    author: "Stephen Hawking"
  },
  {
    id: "4",
    text: "I'm sure the universe is full of intelligent life. It's just been too intelligent to come here.",
    author: "Arthur C. Clarke"
  },
  {
    id: "5",
    text: "The Universe is under no obligation to make sense to you.",
    author: "Neil deGrasse Tyson"
  },
  {
    id: "6",
    text: "For small creatures such as we, the vastness is bearable only through love.",
    author: "Carl Sagan"
  },
  {
    id: "7",
    text: "The nitrogen in our DNA, the calcium in our teeth, the iron in our blood, the carbon in our apple pies were made in the interiors of collapsing stars. We are made of starstuff.",
    author: "Carl Sagan"
  },
  {
    id: "8",
    text: "We are all connected; To each other, biologically. To the earth, chemically. To the rest of the universe atomically.",
    author: "Neil deGrasse Tyson"
  },
  {
    id: "9",
    text: "To confine our attention to terrestrial matters would be to limit the human spirit.",
    author: "Stephen Hawking"
  },
  {
    id: "10",
    text: "The stars are not afraid to appear like fireflies.",
    author: "Rabindranath Tagore"
  }
];

// Celestial Objects Data — 30+ High-Definition Cosmic Atlas
export const celestialObjects: CelestialObject[] = [
  // ==================== SOLAR SYSTEM & SUN ====================
  {
    id: "sun",
    name: "The Sun (Sol)",
    type: "solar",
    image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1800&q=90",
    distance: "149.6 Million km (1 AU)",
    constellation: "Center of Solar System",
    mission: "Solar Dynamics Observatory & Parker Solar Probe",
    description: "The host star of our planetary system, a G-type main-sequence yellow dwarf containing 99.86% of the total mass in the Solar System. Its core reaches 15 million degrees Celsius, fusing 600 million tons of hydrogen every second.",
    keyFact: "Light from the Sun takes roughly 8 minutes and 20 seconds to travel across the vacuum of space to reach your eyes on Earth."
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&w=1800&q=90",
    distance: "778 Million km (5.2 AU)",
    constellation: "Zodiacal Plane",
    mission: "Juno Orbiter & James Webb Space Telescope",
    description: "The undisputed king of planets, Jupiter is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined. It features persistent atmospheric cyclones and powerful ultraviolet auroras.",
    keyFact: "Jupiter's iconic Great Red Spot is a colossal anticyclonic storm larger than Earth that has been raging continuously for over 300 years."
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    image: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&w=1800&q=90",
    distance: "1.4 Billion km (9.5 AU)",
    constellation: "Zodiacal Plane",
    mission: "Cassini-Huygens Mission",
    description: "The jewel of the solar system, famous for its extensive ring system composed of billions of water ice particles and cosmic dust grains ranging from microscopic pebbles to mountain-sized chunks.",
    keyFact: "Despite being 95 times more massive than Earth, Saturn is the only planet in the Solar System that is less dense than water—it would float in a giant bathtub!"
  },
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1800&q=90",
    distance: "225 Million km (1.5 AU)",
    constellation: "Zodiacal Plane",
    mission: "Perseverance Rover & Mars Reconnaissance Orbiter",
    description: "The fourth planet from the Sun, known as the Red Planet due to ubiquitous iron oxide (rust) on its surface. Mars holds ancient dried river deltas, polar ice caps, and evidence of habitable environments in its geological past.",
    keyFact: "Mars is home to Olympus Mons, the largest volcano in the Solar System, which stands nearly three times the height of Mount Everest at 21.9 km."
  },
  {
    id: "earth-moon",
    name: "Earth & The Moon",
    type: "planet",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1800&q=90",
    distance: "0 km (Home Planet) / 384,400 km (Moon)",
    constellation: "Solar System",
    mission: "Apollo, Artemis & International Space Station",
    description: "The blue marble—the only known oasis in the cosmos where conscious life, liquid water oceans, and protective atmospheric shields have flourished for over 3.7 billion years.",
    keyFact: "Earth travels through space orbiting the Sun at an astonishing speed of 107,000 km/h (66,500 mph)."
  },
  {
    id: "europa",
    name: "Europa (Ocean Moon)",
    type: "planet",
    image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1800&q=90",
    distance: "628 Million km (from Earth)",
    constellation: "Orbiting Jupiter",
    mission: "Galileo & Europa Clipper",
    description: "One of Jupiter's Galilean moons, encased in a smooth crust of water ice crisscrossed by reddish fractures. Beneath this ice shell lies a global saltwater ocean containing more water than all of Earth's oceans combined.",
    keyFact: "Tidal gravitational squeezing from Jupiter keeps Europa's subsurface ocean warm and liquid, making it one of humanity's top targets for discovering extraterrestrial life."
  },
  {
    id: "titan",
    name: "Titan (Methane World)",
    type: "planet",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1800&q=90",
    distance: "1.4 Billion km (from Earth)",
    constellation: "Orbiting Saturn",
    mission: "Cassini-Huygens & Dragonfly",
    description: "Saturn's largest moon and the only moon in the Solar System with a dense nitrogen atmosphere. It features a complete hydrological cycle of clouds, rain, rivers, and vast lakes—made of liquid methane and ethane.",
    keyFact: "Titan's atmosphere is 50% denser than Earth's. Combined with its low gravity, a human with strapped-on wings could easily fly through its orange skies!"
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "planet",
    image: "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1800&q=90",
    distance: "4.5 Billion km (30.1 AU)",
    constellation: "Aquarius",
    mission: "Voyager 2 & James Webb Space Telescope",
    description: "The outermost major planet in the Solar System, an ice giant wrapped in vivid blue clouds of methane, ammonia, and water ice. It possesses the most violent supersonic wind speeds ever recorded in our solar neighborhood.",
    keyFact: "Winds in Neptune's high-altitude atmosphere can exceed 2,100 km/h (1,300 mph)—faster than the speed of sound on Earth."
  },
  {
    id: "pluto",
    name: "Pluto & Charon",
    type: "planet",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1800&q=90",
    distance: "5.9 Billion km (39.5 AU)",
    constellation: "Sagittarius / Kuiper Belt",
    mission: "New Horizons Spacecraft",
    description: "A fascinating dwarf planet system at the edge of the Kuiper Belt featuring nitrogen ice glaciers, towering water-ice mountain ranges, and a bright heart-shaped plain named Tombaugh Regio.",
    keyFact: "Pluto and its largest moon Charon form a binary dwarf planet system where both bodies are mutually tidally locked, constantly facing the same side toward each other."
  },

  // ==================== GALAXIES & DEEP FIELD ====================
  {
    id: "andromeda",
    name: "Andromeda Galaxy (M31)",
    type: "galaxy",
    image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1800&q=90",
    distance: "2.5 Million Light-Years",
    constellation: "Andromeda",
    mission: "Hubble Space Telescope & Spitzer",
    description: "The closest giant spiral galaxy to the Milky Way, spanning over 220,000 light-years across and harboring more than 1 trillion stars. In approximately 4.5 billion years, Andromeda and the Milky Way will collide to form a giant elliptical galaxy called Milkomeda.",
    keyFact: "On a dark, moonless night away from city lights, Andromeda is the most distant object visible to the naked human eye."
  },
  {
    id: "whirlpool",
    name: "Whirlpool Galaxy (M51)",
    type: "galaxy",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=90",
    distance: "23 Million Light-Years",
    constellation: "Canes Venatici",
    mission: "Hubble & James Webb Space Telescope",
    description: "A classic grand-design spiral galaxy interacting with its smaller companion galaxy NGC 5195. The gravitational tidal forces between the two galaxies trigger intense bursts of star formation along its winding spiral arms.",
    keyFact: "The Whirlpool Galaxy was the first celestial galaxy in history whose spiral structure was recognized by astronomers in 1845."
  },
  {
    id: "sombrero",
    name: "Sombrero Galaxy (M104)",
    type: "galaxy",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1800&q=90",
    distance: "29 Million Light-Years",
    constellation: "Virgo",
    mission: "Hubble & Spitzer Space Telescopes",
    description: "An unbarred spiral galaxy characterized by a dazzling white spherical bulb of stars surrounded by a prominent, dark absorbing ring of interstellar dust lanes, giving it the appearance of a wide-brimmed Mexican sombrero.",
    keyFact: "At the core of the Sombrero Galaxy lies a supermassive black hole with an estimated mass of 1 billion times that of our Sun."
  },
  {
    id: "cartwheel",
    name: "Cartwheel Galaxy",
    type: "galaxy",
    image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1800&q=90",
    distance: "500 Million Light-Years",
    constellation: "Sculptor",
    mission: "James Webb Space Telescope",
    description: "A rare ring galaxy formed following a direct high-speed collision where a smaller intruder galaxy punched straight through the disk of a spiral galaxy like a pebble dropped in a pond, sending shockwaves of star formation radiating outward.",
    keyFact: "The outer bright ring of the Cartwheel galaxy has expanded to over 150,000 light-years in diameter and is populated by billions of newly born blue stars."
  },
  {
    id: "stephans-quintet",
    name: "Stephan's Quintet",
    type: "galaxy",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=90",
    distance: "290 Million Light-Years",
    constellation: "Pegasus",
    mission: "James Webb Space Telescope",
    description: "A visual compact group of five galaxies locked in an intricate gravitational dance. Four of the galaxies are physically interacting, tearing long tidal tails of stars and gas out of each other and generating massive shockwaves.",
    keyFact: "Webb's infrared cameras revealed for the first time gigantic shockwaves produced as galaxy NGC 7318B smashes through the cluster gas at millions of kilometers per hour."
  },
  {
    id: "deep-field-smacs",
    name: "Webb's Deep Field (SMACS 0723)",
    type: "galaxy",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop&w=1800&q=90",
    distance: "13.1 Billion Light-Years (Background Galaxies)",
    constellation: "Volans",
    mission: "James Webb Space Telescope",
    description: "The deepest and sharpest infrared image of the distant universe to date. A massive galaxy cluster acts as a gravitational lens, magnifying and bending the light of primordial galaxies that formed less than 1 billion years after the Big Bang.",
    keyFact: "This whole image covers a speck of the night sky approximately the size of a single grain of sand held at arm's length."
  },

  // ==================== NEBULAE & STELLAR NURSERIES ====================
  {
    id: "carina-cliffs",
    name: "Carina Nebula Cosmic Cliffs",
    type: "nebula",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1800&q=90",
    distance: "7,600 Light-Years",
    constellation: "Carina",
    mission: "James Webb Space Telescope",
    description: "The boundary of a vast gaseous cavity in NGC 3324, sculpted by intense stellar winds and blistering ultraviolet radiation from gargantuan, hot young stars located just outside the frame.",
    keyFact: "The tallest mountain-like gas pillars in this cosmic cliffscape rise roughly 7 light-years above the dust floor."
  },
  {
    id: "pillars-of-creation",
    name: "Pillars of Creation (M16)",
    type: "nebula",
    image: "https://images.unsplash.com/photo-1570032257806-7272438f38da?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1570032257806-7272438f38da?auto=format&fit=crop&w=1800&q=90",
    distance: "6,500 Light-Years",
    constellation: "Serpens",
    mission: "James Webb & Hubble",
    description: "Iconic towering tendrils of interstellar gas and dust in the Eagle Nebula. Dense globules of gas collapse under their own gravity to ignite the nuclear furnaces of newborn protostars within the columns.",
    keyFact: "The prominent pillar on the left side of the structure spans roughly 4 to 5 light-years from base to tip."
  },
  {
    id: "orion",
    name: "Orion Nebula (M42)",
    type: "nebula",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1800&q=90",
    distance: "1,344 Light-Years",
    constellation: "Orion",
    mission: "Hubble & European Southern Observatory",
    description: "The closest major star-forming region to Earth, visible to the naked eye just south of Orion's Belt. It is a turbulent cosmic laboratory where astronomers have observed hundreds of protoplanetary disks forming around infant stars.",
    keyFact: "The energy illuminating the entire nebula is generated by the Trapezium, a tight cluster of four massive, brilliant young stars at its center."
  },
  {
    id: "helix-nebula",
    name: "Helix Nebula (Eye of God)",
    type: "nebula",
    image: "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1800&q=90",
    distance: "650 Light-Years",
    constellation: "Aquarius",
    mission: "Spitzer, Hubble & VISTA",
    description: "A planetary nebula formed when an intermediate-mass star reached the end of its life, ejecting its outer gaseous layers into space and leaving behind an intensely hot white dwarf core that excites the gas into brilliant fluorescence.",
    keyFact: "The glowing ring structure spans approximately 2.5 light-years across and expands outward at roughly 40 kilometers per second."
  },
  {
    id: "tarantula-nebula",
    name: "Tarantula Nebula (30 Doradus)",
    type: "nebula",
    image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1800&q=90",
    distance: "160,000 Light-Years",
    constellation: "Dorado (Large Magellanic Cloud)",
    mission: "James Webb Space Telescope",
    description: "The largest and most luminous star-forming region in the entire Local Group of galaxies. It is home to thousands of massive young stars and R136a1, the most massive star known to science (over 250 solar masses).",
    keyFact: "If the Tarantula Nebula were as close to Earth as the Orion Nebula, it would cover the sky size of 60 full moons and cast readable light on Earth at night!"
  },
  {
    id: "southern-ring",
    name: "Southern Ring Nebula (NGC 3132)",
    type: "nebula",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=90",
    distance: "2,000 Light-Years",
    constellation: "Vela",
    mission: "James Webb Space Telescope",
    description: "An expanding planetary nebula showcasing concentric shells of ionized gas and dust expelled in waves by a dying central star over thousands of years.",
    keyFact: "Webb's mid-infrared imaging unveiled for the first time that the dying star is cloaked in thick dust and locked in orbit with a companion star."
  },
  {
    id: "crab-nebula",
    name: "Crab Nebula (M1)",
    type: "nebula",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1800&q=90",
    distance: "6,500 Light-Years",
    constellation: "Taurus",
    mission: "Hubble & Chandra X-ray Observatory",
    description: "The expanding supernova remnant of a massive star whose death was recorded by Chinese and Arab astronomers in 1054 AD as a star bright enough to be seen in broad daylight for 23 days.",
    keyFact: "At the heart of the Crab Nebula spins a neutron star (pulsar) 30 times every second, emitting intense beams of radiation across the electromagnetic spectrum."
  },

  // ==================== EXOPLANETS & ALIEN WORLDS ====================
  {
    id: "trappist1e",
    name: "TRAPPIST-1e",
    type: "exoplanet",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1800&q=90",
    distance: "39.6 Light-Years",
    constellation: "Aquarius",
    mission: "Spitzer & James Webb Space Telescope",
    description: "An Earth-sized, rocky exoplanet orbiting within the conservative habitable zone of the ultra-cool dwarf star TRAPPIST-1. It is considered one of the most promising candidates for liquid surface water and life outside our Solar System.",
    keyFact: "TRAPPIST-1e is tidally locked to its star, meaning one side experiences perpetual daylight while the other remains in eternal starlit night."
  },
  {
    id: "kepler22b",
    name: "Kepler-22b (Water World)",
    type: "exoplanet",
    image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1800&q=90",
    distance: "600 Light-Years",
    constellation: "Cygnus",
    mission: "Kepler Space Telescope",
    description: "The first transiting planet confirmed by NASA's Kepler mission to orbit in the habitable zone of a Sun-like star. With a radius 2.4 times that of Earth, it may be a super-Earth covered entirely by a global liquid ocean.",
    keyFact: "Kepler-22b orbits its host star in 290 days, a planetary year remarkably similar to Earth's 365-day journey."
  },
  {
    id: "55-cancri-e",
    name: "55 Cancri e (Lava & Diamond World)",
    type: "exoplanet",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1800&q=90",
    distance: "41 Light-Years",
    constellation: "Cancer",
    mission: "Spitzer & James Webb Space Telescope",
    description: "An ultra-short-period super-Earth orbiting so close to its star that a year lasts only 18 hours. Surface temperatures exceed 2,000°C, melting the dayside crust into oceans of bubbling silicate lava.",
    keyFact: "Because its host star is carbon-rich, astronomers hypothesize that a substantial portion of the planet's thick interior mantle is composed of crystallized diamond."
  },
  {
    id: "proxima-b",
    name: "Proxima Centauri b",
    type: "exoplanet",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1800&q=90",
    distance: "4.24 Light-Years",
    constellation: "Centaurus",
    mission: "HARPS / European Southern Observatory",
    description: "The closest known exoplanet to our Solar System, orbiting within the habitable zone of our neighboring red dwarf star, Proxima Centauri. It has a minimum mass 1.17 times that of Earth.",
    keyFact: "Even with current chemical rockets taking 70,000 years to reach it, laser-propelled nanocraft could travel to Proxima b in just 20 years!"
  },
  {
    id: "kepler186f",
    name: "Kepler-186f",
    type: "exoplanet",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1800&q=90",
    distance: "582 Light-Years",
    constellation: "Cygnus",
    mission: "Kepler Space Telescope",
    description: "The first Earth-sized planet discovered in the habitable zone of another star. It receives about one-third of the sunlight that Earth receives from the Sun, creating a permanent twilight landscape.",
    keyFact: "At high noon on Kepler-186f, the host red dwarf star appears about 30% larger in the sky than the Sun does on Earth, but with a gentle orange-red glow."
  },

  // ==================== BLACK HOLES & COSMIC EXTREMES ====================
  {
    id: "sagittarius-a",
    name: "Sagittarius A* (Milky Way Heart)",
    type: "blackhole",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=90",
    distance: "26,000 Light-Years",
    constellation: "Sagittarius",
    mission: "Event Horizon Telescope (EHT)",
    description: "The supermassive black hole anchoring the rotational center of our home galaxy, the Milky Way. It has a mass equivalent to 4.15 million Suns packed inside a region smaller than Mercury's orbit.",
    keyFact: "In 2022, the Event Horizon Telescope combined radio dishes across the entire globe to produce the historic first direct image of the glowing shadow of Sagittarius A*."
  },
  {
    id: "m87-blackhole",
    name: "M87* Supermassive Black Hole",
    type: "blackhole",
    image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1800&q=90",
    distance: "55 Million Light-Years",
    constellation: "Virgo",
    mission: "Event Horizon Telescope",
    description: "A cosmic behemoth at the center of the giant elliptical galaxy Messier 87. It contains 6.5 billion solar masses and propels a relativistic jet of plasma spanning over 5,000 light-years across space.",
    keyFact: "M87* was the subject of the world's first-ever direct image of a black hole's event horizon, revealed to humanity on April 10, 2019."
  },
  {
    id: "crab-pulsar",
    name: "Crab Nebula Pulsar (PSR B0531+21)",
    type: "blackhole",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
    hdImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=90",
    distance: "6,500 Light-Years",
    constellation: "Taurus",
    mission: "Chandra X-ray Observatory & Fermi",
    description: "A city-sized neutron star with a mass greater than the Sun, spinning at an incredible 30 revolutions per second. It acts as a cosmic cosmic lighthouse, sweeping beams of electromagnetic energy across space.",
    keyFact: "A single teaspoon of the neutron star matter that makes up the Crab Pulsar would weigh over 1 billion tons on Earth!"
  }
];

// Cosmic Patterns Data
export const cosmicPatterns: CosmicPattern[] = [
  {
    id: "pattern1",
    image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    question: "If consciousness affects reality at the quantum level, how might your thoughts be shaping the universe?",
    affirmation: "I am a conscious participant in the universal flow of cosmic energy."
  },
  {
    id: "pattern2",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    question: "What if the stars you see at night are sending you personal messages across time and space?",
    affirmation: "I am connected to the vast wisdom of the universe."
  },
  {
    id: "pattern3",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    question: "How might your life change if you viewed yourself as a cosmic being having a human experience?",
    affirmation: "I am an eternal cosmic being experiencing the physical world."
  },
  {
    id: "pattern4",
    image: "https://images.unsplash.com/photo-1570032257806-7272438f38da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    question: "If you could communicate with any celestial body, which would you choose and what would you ask?",
    affirmation: "My intuition guides me to cosmic wisdom beyond logical understanding."
  }
];

// Cosmic Sounds Data
export const cosmicSounds: CosmicSound[] = [
  {
    id: "voyager",
    title: "Voyager Golden Record",
    description: "Sounds of Earth traveling beyond our solar system",
    audioUrl: "https://cdn.freesound.org/previews/542/542092_7374079-lq.mp3"
  },
  {
    id: "saturn",
    title: "Saturn's Radio Emissions",
    description: "Electromagnetic waves captured by Cassini",
    audioUrl: "https://cdn.freesound.org/previews/529/529515_11232529-lq.mp3"
  },
  {
    id: "pulsar",
    title: "Pulsar PSR B0329+54",
    description: "Radio signals from a rapidly rotating neutron star",
    audioUrl: "https://cdn.freesound.org/previews/323/323099_5865517-lq.mp3"
  },
  {
    id: "sun",
    title: "Solar Sonification",
    description: "The Sun's vibrations converted to audible sound",
    audioUrl: "https://cdn.freesound.org/previews/459/459657_9015615-lq.mp3"
  }
];

// Quiz Questions
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "When gazing at the night sky, what draws your attention most?",
    options: [
      "The patterns of constellations and their stories",
      "The vastness and infinite possibilities",
      "The scientific wonders and celestial mechanics",
      "The potential for other intelligent life"
    ]
  },
  {
    id: 2,
    question: "How do you prefer to explore cosmic ideas?",
    options: [
      "Through meditation and inner journeys",
      "By reading scientific articles and studies",
      "Watching documentaries about space",
      "Discussing philosophical questions with others"
    ]
  },
  {
    id: 3,
    question: "If you could have one cosmic ability, what would it be?",
    options: [
      "To travel instantly to any point in the universe",
      "To communicate with cosmic consciousness",
      "To understand all physical laws of the universe",
      "To see the past and future of celestial objects"
    ]
  },
  {
    id: 4,
    question: "What aspect of existence most fascinates you?",
    options: [
      "The possibility of multiple dimensions",
      "The interconnectedness of all things",
      "The physical laws that govern reality",
      "The possibility of life beyond Earth"
    ]
  },
  {
    id: 5,
    question: "What do you seek most from your cosmic journey?",
    options: [
      "Spiritual enlightenment",
      "Scientific understanding",
      "Wonder and inspiration",
      "Connection with something greater"
    ]
  }
];

// Quiz Results
export const quizResults: QuizResult[] = [
  {
    title: "Stellar Seeker",
    description: "You are drawn to the mysteries of the cosmos and seek spiritual growth through cosmic connection. Your intuitive nature helps you perceive patterns others miss.",
    archetype: "Seeker"
  },
  {
    title: "Quantum Explorer",
    description: "You blend scientific curiosity with spiritual openness. You're fascinated by the quantum nature of reality and how consciousness interacts with the physical world.",
    archetype: "Explorer"
  },
  {
    title: "Cosmic Sage",
    description: "Your wisdom comes from understanding the interconnectedness of all things. You see the universe as a living entity and yourself as an integral part of it.",
    archetype: "Sage"
  },
  {
    title: "Astral Voyager",
    description: "You're a natural traveler of the mind and spirit. Your imagination allows you to journey beyond physical limitations and explore the frontiers of consciousness.",
    archetype: "Voyager"
  },
  {
    title: "Star Weaver",
    description: "You see the threads that connect all beings and events. You have a gift for finding meaning in cosmic coincidences and weaving them into your life story.",
    archetype: "Weaver"
  }
];
