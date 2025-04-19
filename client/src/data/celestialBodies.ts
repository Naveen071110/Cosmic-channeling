export type CelestialBodyType = 'planets' | 'galaxies' | 'nebulae' | 'exoplanets';

export interface CelestialBody {
  id: string;
  name: string;
  type: CelestialBodyType;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  cosmicQuote: string;
}

export const celestialBodies: CelestialBody[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planets',
    description: 'The closest planet to the Sun, Mercury experiences extreme temperature variations and has a heavily cratered surface similar to our Moon.',
    imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/05/mercury-messenger-globe-pia15162-800x803.jpg',
    cosmicQuote: 'Like Mercury, embrace the extremes of existence, for transformation occurs in the space between opposites.'
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planets',
    description: 'Often called Earth\'s sister planet, Venus has a thick, toxic atmosphere filled with carbon dioxide and sulfuric acid clouds.',
    imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/05/Venus-800x803.jpg',
    cosmicQuote: 'Venus teaches us that great beauty often conceals profound complexity beneath the surface.'
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planets',
    description: 'Our home planet is the only world known to harbor life, with its protective atmosphere and vast oceans of liquid water.',
    imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/05/as17-148-22727-earth-full-disk-apollo-17-800x803.jpg',
    cosmicQuote: 'We are not merely on Earth, we are part of Earth—a single conscious system in the cosmic dance.'
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planets',
    description: 'The Red Planet features the largest volcano and canyon in our solar system, with evidence suggesting it once had flowing water.',
    imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/05/Mars-800x803.jpg',
    cosmicQuote: 'Mars reminds us that what once flowed with life may appear dormant, yet holds the potential for rebirth.'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planets',
    description: 'The largest planet in our solar system, Jupiter is a gas giant with a mesmerizing banded appearance and a Great Red Spot that has raged for centuries.',
    imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/05/Jupiter-800x803.jpg',
    cosmicQuote: 'Like Jupiter\'s continuous storms, chaos contains patterns of profound cosmic order when viewed from a higher perspective.'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planets',
    description: 'Known for its spectacular ring system, Saturn is a gas giant composed primarily of hydrogen and helium with a mesmerizing hexagonal storm at its north pole.',
    imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/05/Saturn-800x803.jpg',
    cosmicQuote: 'Saturn teaches us that our boundaries and limitations often become our most distinctive and beautiful features.'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planets',
    description: 'Uranus rotates on its side with its axis pointing nearly toward the Sun, resulting in extreme seasonal variations during its 84-year orbit.',
    imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/05/uranus-voyager-1-800x803.jpg',
    cosmicQuote: 'Sometimes the most profound cosmic wisdom comes from turning your perspective completely sideways.'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planets',
    description: 'The windiest planet in our solar system, Neptune has active, visible weather patterns with winds reaching supersonic speeds of over 1,200 mph.',
    imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/05/neptune-voyager-1-800x803.jpg',
    cosmicQuote: 'Even in the cold outer reaches of existence, energy and transformation continue their cosmic dance.'
  },
  {
    id: 'milky-way',
    name: 'Milky Way',
    type: 'galaxies',
    description: 'Our home galaxy contains billions of stars, including our Sun, and is part of the Local Group of galaxies.',
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    cosmicQuote: 'We are not merely in the Milky Way—we are the Milky Way experiencing itself through conscious awareness.'
  },
  {
    id: 'andromeda',
    name: 'Andromeda',
    type: 'galaxies',
    description: 'The nearest major galaxy to the Milky Way, Andromeda is on a collision course with our galaxy and will merge with it in about 4.5 billion years.',
    imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/05/PIA15416-AndromedaGalaxy-M31-20150121-750x751.jpg',
    cosmicQuote: 'What appears as cosmic collision is actually a dance of unity, as separate forms merge into greater wholeness.'
  },
  {
    id: 'triangulum',
    name: 'Triangulum Galaxy',
    type: 'galaxies',
    description: 'The third-largest member of the Local Group, this spiral galaxy contains about 40 billion stars and has minimal galactic bulge.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Triangulum_Galaxy_Messier_33_%28cropped%29.jpg/800px-Triangulum_Galaxy_Messier_33_%28cropped%29.jpg',
    cosmicQuote: 'In cosmic geometry, every point is both center and periphery, just as each conscious being is both individual and universal.'
  },
  {
    id: 'orion',
    name: 'Orion Nebula',
    type: 'nebulae',
    description: 'A stellar nursery where new stars are being born, visible to the naked eye as a fuzzy patch in the Orion constellation.',
    imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/03/orion-nebula-2652Xauto.jpg',
    cosmicQuote: 'In the cosmic womb of creation, light emerges from darkness, bringing form to formless potential.'
  },
  {
    id: 'crab',
    name: 'Crab Nebula',
    type: 'nebulae',
    description: 'The remnant of a supernova explosion observed by astronomers in 1054 AD, containing a pulsar at its center.',
    imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/03/crab-nebula-800x803.jpg',
    cosmicQuote: 'From cosmic death comes rebirth, as the elements of stars become the building blocks of future worlds.'
  },
  {
    id: 'butterfly',
    name: 'Butterfly Nebula',
    type: 'nebulae',
    description: 'A bipolar planetary nebula in the constellation Scorpius, formed by the death of a Sun-like star.',
    imageUrl: 'https://cdn.spacetelescope.org/archives/images/large/heic0910h.jpg',
    cosmicQuote: 'The most profound transformations in the universe mirror our own spiritual metamorphosis, from limited to limitless.'
  },
  {
    id: 'kepler-452b',
    name: 'Kepler-452b',
    type: 'exoplanets',
    description: 'Sometimes called "Earth\'s cousin," this exoplanet orbits a Sun-like star in the habitable zone where liquid water could exist.',
    imageUrl: 'https://www.nasa.gov/wp-content/uploads/2015/07/452b_artistconcept_beautyshot.png',
    cosmicQuote: 'Across the vast cosmic ocean, patterns of life may mirror our own, yet express themselves in unimaginable diversity.'
  },
  {
    id: 'trappist-1e',
    name: 'TRAPPIST-1e',
    type: 'exoplanets',
    description: 'One of seven Earth-sized planets orbiting the ultra-cool dwarf star TRAPPIST-1, this world may be habitable.',
    imageUrl: 'https://www.nasa.gov/wp-content/uploads/2017/02/trappist-1e_0.png',
    cosmicQuote: 'Even in the dimmer light of distant stars, the potential for consciousness finds its expression.'
  },
  {
    id: 'hd189733b',
    name: 'HD 189733b',
    type: 'exoplanets',
    description: 'A vivid blue exoplanet where it rains glass sideways in hypersonic winds. This hot Jupiter is one of the most studied exoplanets.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/NASA-HD189733b-ExoPlanet-20130711.jpg/800px-NASA-HD189733b-ExoPlanet-20130711.jpg',
    cosmicQuote: 'In the harshest cosmic environments, beauty and wonder still manifest in unexpected forms.'
  }
];
