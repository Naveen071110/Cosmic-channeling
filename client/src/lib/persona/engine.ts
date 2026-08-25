import { CosmicPersona, QuestionnaireAnswers, DimensionScores, ArchetypeId, CosmicElement, DailyAlignmentInsight } from './types';
import { COSMIC_ARCHETYPES } from './archetypes';
import { COSMIC_QUESTIONNAIRE } from './questions';

export function calculateStardate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const start = new Date(year, 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return `SD ${year}.${dayOfYear}`;
}

export function calculatePersona(answers: QuestionnaireAnswers): CosmicPersona {
  const archetypeCounts: Record<ArchetypeId, number> = {
    'stellar-seeker': 0,
    'nebula-mystic': 0,
    'solar-alchemist': 0,
    'lunar-harmonizer': 0,
    'galactic-architect': 0,
    'astral-anchor': 0,
  };

  const rawDimensions: DimensionScores = {
    intuition: 0,
    curiosity: 0,
    vitality: 0,
    harmony: 0,
    transcendence: 0,
  };

  // Process Q1: Horizon
  const q1Choice = COSMIC_QUESTIONNAIRE[0].choices[answers.horizon] || COSMIC_QUESTIONNAIRE[0].choices[0];
  archetypeCounts[q1Choice.archetypeAffinity as ArchetypeId] += 2;
  accumulateDimensions(rawDimensions, q1Choice.dimensionWeights);

  // Process Q2: Sound
  const q2Choice = COSMIC_QUESTIONNAIRE[1].choices[answers.sound] || COSMIC_QUESTIONNAIRE[1].choices[0];
  archetypeCounts[q2Choice.archetypeAffinity as ArchetypeId] += 2;
  accumulateDimensions(rawDimensions, q2Choice.dimensionWeights);

  // Process Q3: Hour
  const q3Choice = COSMIC_QUESTIONNAIRE[2].choices[answers.hour] || COSMIC_QUESTIONNAIRE[2].choices[0];
  archetypeCounts[q3Choice.archetypeAffinity as ArchetypeId] += 1.5;
  accumulateDimensions(rawDimensions, q3Choice.dimensionWeights);

  // Process Q4: Reflection
  const q4Choice = COSMIC_QUESTIONNAIRE[3].choices[answers.reflection] || COSMIC_QUESTIONNAIRE[3].choices[0];
  archetypeCounts[q4Choice.archetypeAffinity as ArchetypeId] += 1.5;
  accumulateDimensions(rawDimensions, q4Choice.dimensionWeights);

  // Process Q5: Element
  const elementIndexMap: Record<CosmicElement, number> = {
    Fire: 0,
    Water: 1,
    Air: 2,
    Earth: 3,
    Ether: 4,
  };
  const elementIdx = elementIndexMap[answers.element] ?? 2;
  const q5Choice = COSMIC_QUESTIONNAIRE[4].choices[elementIdx] || COSMIC_QUESTIONNAIRE[4].choices[0];
  archetypeCounts[q5Choice.archetypeAffinity as ArchetypeId] += 2.5;
  accumulateDimensions(rawDimensions, q5Choice.dimensionWeights);

  // Determine highest scoring archetype
  let highestScore = -1;
  let winningArchetypeId: ArchetypeId = 'stellar-seeker';

  (Object.keys(archetypeCounts) as ArchetypeId[]).forEach((id) => {
    if (archetypeCounts[id] > highestScore) {
      highestScore = archetypeCounts[id];
      winningArchetypeId = id;
    }
  });

  const normalizedDimensions: DimensionScores = {
    intuition: Math.min(100, Math.max(35, Math.round(rawDimensions.intuition * 0.75))),
    curiosity: Math.min(100, Math.max(35, Math.round(rawDimensions.curiosity * 0.75))),
    vitality: Math.min(100, Math.max(35, Math.round(rawDimensions.vitality * 0.75))),
    harmony: Math.min(100, Math.max(35, Math.round(rawDimensions.harmony * 0.75))),
    transcendence: Math.min(100, Math.max(35, Math.round(rawDimensions.transcendence * 0.75))),
  };

  const archetype = COSMIC_ARCHETYPES[winningArchetypeId];

  return {
    archetypeId: winningArchetypeId,
    archetype,
    element: answers.element,
    rulingFrequency: archetype.rulingFrequency,
    dimensions: normalizedDimensions,
    answers,
    completedAt: new Date().toISOString(),
    stardate: calculateStardate(),
  };
}

function accumulateDimensions(target: DimensionScores, source: DimensionScores) {
  target.intuition += source.intuition;
  target.curiosity += source.curiosity;
  target.vitality += source.vitality;
  target.harmony += source.harmony;
  target.transcendence += source.transcendence;
}

export function calculateDailyAlignment(
  persona: CosmicPersona,
  lunarData?: { phase?: string; illumination?: number },
  ephemerisData?: { twilight?: string; clarity?: number }
): DailyAlignmentInsight {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Deterministic daily resonance pseudo-hash (fluctuates organically between 82% and 99%)
  const seed = (dayOfYear * 13 + persona.rulingFrequency * 7 + (persona.element.charCodeAt(0) || 65)) % 100;
  const alignmentScore = 80 + Math.floor((seed / 100) * 19);

  const phase = lunarData?.phase || 'Waxing Moon';
  const clarity = ephemerisData?.clarity || 88;

  let directive = '';
  let affirmation = '';
  let journalPrompt = '';

  switch (persona.archetypeId) {
    case 'stellar-seeker':
      directive = `The cosmic atmosphere exhibits ${clarity}% clarity tonight. Your Air element is in harmonious resonance with the Andromeda core. Gaze outward, engage your curious intellect, and channel deep questions into focused discovery.`;
      affirmation = 'I am an conscious node of the universe, designed to explore and understand its boundless beauty.';
      journalPrompt = 'What deep-space mystery or life question has been occupying your thoughts lately? Write without filtering.';
      break;

    case 'nebula-mystic':
      directive = `Today's lunar cycle (${phase}) creates a gentle, nurturing current for your Water element. Enter the quiet sanctuary of the 432 Hz frequency to dissolve ego chatter and listen to the voice of your dreams.`;
      affirmation = 'In the quiet stillness of the cosmos, my intuition speaks clearly and guides my every step.';
      journalPrompt = 'Reflect on a recent dream, synchronicity, or gut feeling. What message is your subconscious offering?';
      break;

    case 'solar-alchemist':
      directive = `Solar winds and daily diurnal tides are actively charging your Fire element. Your creative manifestation energy is peaked at ${alignmentScore}%. Meditate at 528 Hz and take decisive action on your most meaningful goal.`;
      affirmation = 'I carry the fire of collapsing stars within my soul; my creative energy transforms everything I touch.';
      journalPrompt = 'What project, habit, or relationship are you ready to infuse with fresh solar vitality and courage?';
      break;

    case 'lunar-harmonizer':
      directive = `The Moon is currently at ${phase}, creating rhythmic tides that resonate directly with your emotional wisdom. Practice 4-4-4-4 box breathing at 639 Hz to restore equilibrium across your relationships.`;
      affirmation = 'I trust the natural waxing and waning of life; I release what is complete and welcome what is arriving.';
      journalPrompt = 'What in your life is ready to be gently released, and what new intention are you nurturing into growth?';
      break;

    case 'galactic-architect':
      directive = `Spacetime geometries are aligned with your Ether element. Your macrocosmic intuition is heightened today. Tune into 963 Hz to perceive the unified patterns underlying apparent chaotic situations.`;
      affirmation = 'I see the grand tapestry beyond temporary shadows; all things are moving toward universal harmony.';
      journalPrompt = 'Zoom out to a 10,000-foot view of your life. What overarching design or lesson is emerging from your recent challenges?';
      break;

    case 'astral-anchor':
    default:
      directive = `Your Earth element provides a solid foundation as celestial rhythms shift. Ground yourself with 396 Hz tones, breathe deeply with the living Earth, and anchor peace into your immediate surroundings.`;
      affirmation = 'My roots reach into the stardust of the Earth; I am centered, resilient, and deeply present.';
      journalPrompt = 'What simple physical reality or moment of human connection brought you authentic peace today?';
      break;
  }

  return {
    alignmentScore,
    directive,
    lunarResonance: `${phase} • ${alignmentScore}% Coherence`,
    recommendedFrequency: persona.rulingFrequency,
    frequencyLabel: persona.archetype.frequencyName,
    optimalMeditationTime: 'Astronomical Twilight & Evening Stargazing',
    patronBodyInSky: persona.archetype.patronCelestialBody,
    affirmation,
    journalPrompt,
  };
}
