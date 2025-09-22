import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface GeometryPattern {
  shape: string;
  transform: string;
  color: string;
  timing: number;
}

export interface MeditationData {
  pattern: string;
  duration: number;
  frequencies: Array<{ hz: number; type: string }>;
  geometry_sequence: GeometryPattern[];
  neural_targets: string[];
  consciousness_level: string;
  guided_text: string;
}

export interface AffirmationData {
  text: string;
  category: string;
  vibrational_frequency: number;
  cosmic_alignment: string;
  personalization_factors: string[];
}

export interface SoundscapeData {
  name: string;
  frequencies: Array<{ hz: number; type: string; amplitude: number }>;
  duration: number;
  galactic_type: string;
  audio_params: {
    reverb: number;
    delay: number;
    filter: string;
    modulation: number;
  };
}

export interface NeuralPatternData {
  pattern_type: string;
  brain_waves: {
    alpha: number;
    theta: number;
    delta: number;
    beta: number;
    gamma: number;
  };
  visualization_data: {
    nodes: Array<{ x: number; y: number; intensity: number }>;
    connections: Array<{ from: number; to: number; strength: number }>;
  };
  activation_sequence: Array<{ timestamp: number; region: string; intensity: number }>;
}

export interface ChatResponse {
  content: string;
  context_references?: string[];
  suggested_actions?: string[];
}

export async function generateSacredGeometryMeditation(
  intention?: string,
  duration: number = 1260
): Promise<MeditationData> {
  try {
    // Mock response for testing purposes when OpenAI is not available
    if (process.env.NODE_ENV === 'development') {
      const patterns = ['flower_of_life', 'vesica_piscis', 'merkaba', 'tetrahedron', 'golden_ratio_spiral'];
      const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
      
      return {
        pattern: selectedPattern,
        duration,
        frequencies: [
          { hz: 528, type: "love_frequency" },
          { hz: 432, type: "cosmic_tuning" },
          { hz: 963, type: "crown_chakra" }
        ],
        geometry_sequence: [
          { shape: "circle", transform: "rotate(0deg)", color: "#6366F1", timing: 0 },
          { shape: "vesica_piscis", transform: "rotate(60deg)", color: "#F59E0B", timing: 180 },
          { shape: "flower_center", transform: "scale(1.2)", color: "#A855F7", timing: 360 }
        ],
        neural_targets: ["prefrontal_cortex", "default_mode_network", "pineal_activation"],
        consciousness_level: "theta_gamma_sync",
        guided_text: `Begin by focusing on the ${selectedPattern.replace(/_/g, ' ')} pattern. ${intention ? `Let your intention of ${intention} guide your awareness.` : 'Allow universal consciousness to flow through you.'} Feel the sacred geometry activating your neural pathways as you enter deeper states of awareness.`
      };
    }

    const prompt = `Generate a sacred geometry meditation session. ${intention ? `Focus on: ${intention}` : 'Create a general consciousness expansion session.'}
    
Duration: ${duration} seconds

Create a JSON response with:
- pattern: name of sacred geometry pattern (flower_of_life, vesica_piscis, merkaba, etc.)
- duration: session length in seconds
- frequencies: array of healing frequencies with hz and type
- geometry_sequence: sequence of geometric shapes with transforms, colors, and timing
- neural_targets: brain regions to activate
- consciousness_level: target brainwave state
- guided_text: meditation narration text

Make it authentic and based on real sacred geometry principles and neuroscience.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert in sacred geometry, neuroscience, and consciousness expansion. Generate authentic meditation experiences based on real principles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    throw new Error(`Failed to generate sacred geometry meditation: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function generateCosmicAffirmation(
  userInput?: {
    intention?: string;
    lifeArea?: string;
    personality?: string;
  }
): Promise<AffirmationData> {
  try {
    // Mock response for testing purposes when OpenAI is not available
    if (process.env.NODE_ENV === 'development') {
      const categories = ['abundance', 'unity', 'transformation', 'peace', 'wisdom', 'harmony'];
      const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
      const constellations = ['Sirius', 'Pleiades', 'Andromeda', 'Vega', 'Arcturus'];
      
      const affirmationTexts = {
        abundance: "I am aligned with the infinite abundance of the universe, flowing effortlessly through cosmic channels of prosperity",
        unity: "I recognize my oneness with all existence, connected through the sacred web of universal consciousness",
        transformation: "I embrace the cosmic forces of transformation, allowing my soul to evolve into its highest expression",
        peace: "I radiate the tranquil harmony of cosmic peace, centered in the stillness of universal truth",
        wisdom: "I channel the ancient wisdom of the cosmos, accessing knowledge beyond the limitations of time and space",
        harmony: "I vibrate in perfect harmony with the cosmic symphony, attuned to the frequencies of divine creation"
      };
      
      return {
        text: affirmationTexts[selectedCategory as keyof typeof affirmationTexts],
        category: selectedCategory,
        vibrational_frequency: Math.floor(Math.random() * 500) + 300, // 300-800 Hz range
        cosmic_alignment: constellations[Math.floor(Math.random() * constellations.length)],
        personalization_factors: userInput ? Object.keys(userInput).filter(key => userInput[key as keyof typeof userInput]) : ["universal_consciousness"]
      };
    }

    const prompt = `Generate a personalized cosmic consciousness affirmation.
    
User context: ${JSON.stringify(userInput || {})}

Create a JSON response with:
- text: the affirmation text (powerful, cosmic, consciousness-expanding)
- category: type of affirmation (abundance, unity, transformation, etc.)
- vibrational_frequency: frequency in hz that aligns with the affirmation
- cosmic_alignment: celestial/cosmic principle it connects to
- personalization_factors: array of factors used for personalization

Base on real cosmic consciousness principles and universal laws.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a master of cosmic consciousness and universal principles. Create profound affirmations that connect individuals to universal consciousness."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    throw new Error(`Failed to generate cosmic affirmation: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function generateGalacticSoundscape(
  type: string = "cosmic_harmony",
  duration: number = 600
): Promise<SoundscapeData> {
  try {
    // Mock response for testing purposes when OpenAI is not available
    if (process.env.NODE_ENV === 'development') {
      const galacticTypes = ['nebula', 'pulsar', 'black_hole', 'galaxy_rotation', 'cosmic_wind', 'stellar_nursery'];
      const selectedType = galacticTypes[Math.floor(Math.random() * galacticTypes.length)];
      
      const soundscapeNames = {
        nebula: "Ethereal Nebula Whispers",
        pulsar: "Rhythmic Pulsar Resonance", 
        black_hole: "Event Horizon Harmonics",
        galaxy_rotation: "Spiral Galaxy Symphony",
        cosmic_wind: "Solar Wind Chorus",
        stellar_nursery: "Stellar Birth Frequencies"
      };
      
      return {
        name: soundscapeNames[selectedType as keyof typeof soundscapeNames],
        frequencies: [
          { hz: 40, type: "sub_bass", amplitude: 0.3 },
          { hz: 110, type: "fundamental", amplitude: 0.6 },
          { hz: 528, type: "healing", amplitude: 0.4 },
          { hz: 852, type: "cosmic", amplitude: 0.2 }
        ],
        duration,
        galactic_type: selectedType,
        audio_params: {
          reverb: 0.7,
          delay: 0.3,
          filter: "lowpass",
          modulation: 0.2
        }
      };
    }

    const prompt = `Generate a galactic soundscape for consciousness expansion.
    
Type: ${type}
Duration: ${duration} seconds

Create a JSON response with:
- name: descriptive name for the soundscape
- frequencies: array of frequencies with hz, type, and amplitude
- duration: length in seconds
- galactic_type: cosmic theme (nebula, pulsar, black_hole, galaxy_rotation, etc.)
- audio_params: reverb, delay, filter, modulation settings for Web Audio API

Base on real astronomical phenomena and sound healing principles.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert in sound healing, astronomy, and consciousness expansion through audio. Generate authentic cosmic soundscapes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    throw new Error(`Failed to generate galactic soundscape: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function generateNeuralPattern(
  consciousnessState: string = "theta_gamma_sync"
): Promise<NeuralPatternData> {
  try {
    // Mock response for testing purposes when OpenAI is not available
    if (process.env.NODE_ENV === 'development') {
      const patternTypes = ['theta_gamma_sync', 'alpha_coherence', 'default_mode_suppression', 'flow_state', 'transcendental'];
      const selectedType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      
      // Generate mock brain wave data
      const brainWaves = {
        alpha: 8 + Math.random() * 5, // 8-13 Hz
        theta: 4 + Math.random() * 4, // 4-8 Hz  
        delta: 0.5 + Math.random() * 3.5, // 0.5-4 Hz
        beta: 13 + Math.random() * 17, // 13-30 Hz
        gamma: 30 + Math.random() * 70 // 30-100 Hz
      };
      
      // Generate mock visualization nodes
      const nodes = [];
      const connections = [];
      for (let i = 0; i < 12; i++) {
        nodes.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          intensity: Math.random()
        });
      }
      
      // Generate connections between nodes
      for (let i = 0; i < nodes.length - 1; i++) {
        connections.push({
          from: i,
          to: (i + 1) % nodes.length,
          strength: Math.random()
        });
      }
      
      // Generate activation sequence
      const regions = ['prefrontal_cortex', 'parietal_lobe', 'temporal_lobe', 'occipital_lobe', 'cerebellum'];
      const activationSequence = regions.map((region, index) => ({
        timestamp: index * 1000,
        region,
        intensity: Math.random()
      }));
      
      return {
        pattern_type: selectedType,
        brain_waves: brainWaves,
        visualization_data: { nodes, connections },
        activation_sequence: activationSequence
      };
    }

    const prompt = `Generate neural pathway activation pattern for consciousness expansion.
    
Target state: ${consciousnessState}

Create a JSON response with:
- pattern_type: type of neural pattern
- brain_waves: frequencies for alpha, theta, delta, beta, gamma in hz
- visualization_data: nodes (x, y coordinates, intensity) and connections (from node, to node, strength)
- activation_sequence: timeline of brain region activations with timestamps and intensities

Base on real neuroscience and brainwave research.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a neuroscientist specializing in consciousness research and brain wave patterns. Generate authentic neural activation patterns."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    throw new Error(`Failed to generate neural pattern: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function generateNeuroscienceChatResponse(
  message: string,
  chatHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<ChatResponse> {
  try {
    // Mock response for testing purposes when OpenAI is not available
    if (process.env.NODE_ENV === 'development') {
      // Context-aware responses based on message content
      const messageLower = message.toLowerCase();
      
      if (messageLower.includes('sacred geometry') || messageLower.includes('meditation')) {
        return {
          content: "Sacred geometry meditation harnesses ancient mathematical patterns to activate specific neural pathways in your brain. The Flower of Life pattern, for example, resonates at frequencies that promote theta-gamma synchronization, leading to expanded consciousness states. This occurs through entrainment of your default mode network, allowing deeper introspection and spiritual insight.",
          context_references: ["Sacred Geometry Meditation", "Neural Pathway Activation"],
          suggested_actions: ["Try a Sacred Geometry meditation", "Explore Neural Pathway patterns"]
        };
      }
      
      if (messageLower.includes('affirmation') || messageLower.includes('cosmic')) {
        return {
          content: "Cosmic affirmations work by programming your subconscious mind with positive neural patterns. When aligned with specific vibrational frequencies, these affirmations create new synaptic connections that reinforce desired beliefs and behaviors. The cosmic alignment aspect connects your personal frequency to universal consciousness, amplifying the manifestation process.",
          context_references: ["Cosmic Consciousness Affirmations"],
          suggested_actions: ["Generate personalized cosmic affirmations", "Explore vibrational frequencies"]
        };
      }
      
      if (messageLower.includes('sound') || messageLower.includes('frequency') || messageLower.includes('chant')) {
        return {
          content: "Galactic soundscapes utilize specific frequency combinations that correspond to astronomical phenomena and their effects on human consciousness. Each frequency targets different brainwave states - for example, 528 Hz (the 'love frequency') promotes healing and DNA repair, while 432 Hz creates cosmic harmony. The reverb and modulation parameters simulate the vastness of space, triggering deep meditative states.",
          context_references: ["Galactic Chant Synthesizer"],
          suggested_actions: ["Create a custom soundscape", "Learn about healing frequencies"]
        };
      }
      
      if (messageLower.includes('neural') || messageLower.includes('brain') || messageLower.includes('pathway')) {
        return {
          content: "Neural pathway activation involves stimulating specific brain regions through synchronized frequency patterns. When you achieve theta-gamma coherence, your prefrontal cortex and default mode network work together to create heightened awareness states. This process activates dormant neural circuits, potentially unlocking latent psychic abilities and deeper spiritual understanding.",
          context_references: ["Neural Pathway Activation Visualizer"],
          suggested_actions: ["Activate your neural patterns", "Explore brainwave synchronization"]
        };
      }
      
      if (messageLower.includes('heart') || messageLower.includes('galaxy') || messageLower.includes('connection')) {
        return {
          content: "The heart-galaxy connection is based on the electromagnetic field generated by your heart, which extends far beyond your body and can theoretically connect with cosmic electromagnetic fields. When your heart achieves coherence, it synchronizes with galactic rhythms, creating a bridge between personal consciousness and universal intelligence. This connection facilitates profound spiritual experiences and cosmic awareness.",
          context_references: ["Heart-Galaxy Connection Experience"],
          suggested_actions: ["Experience heart-galaxy synchronization", "Measure your heart coherence"]
        };
      }
      
      // General consciousness/neuroscience responses
      return {
        content: "NeuraPeace AI combines cutting-edge neuroscience with ancient wisdom traditions to facilitate consciousness expansion. Our five core modalities - Sacred Geometry, Cosmic Affirmations, Galactic Soundscapes, Neural Pathway Activation, and Heart-Galaxy Connection - each target specific aspects of human consciousness through scientifically-backed methods. What aspect of consciousness expansion interests you most?",
        context_references: ["NeuraPeace AI Overview"],
        suggested_actions: ["Explore Sacred Geometry meditation", "Try Cosmic Affirmations", "Create Galactic soundscapes"]
      };
    }

    const systemPrompt = `You are NeuraGuide, a compassionate and empathetic AI consciousness expansion specialist with deep expertise in neuroscience, sacred geometry, sound healing, and cosmic consciousness. You understand that every person's spiritual journey is unique and approach each interaction with warmth, understanding, and genuine care for their wellbeing.

## Core Expertise Areas:

**Neuroscience & Brain Function:**
- Neuroplasticity and how meditation rewires neural pathways
- Brainwave states (Alpha 8-12Hz for relaxation, Theta 4-8Hz for deep meditation, Gamma 30-100Hz for heightened awareness)
- Default Mode Network and its role in ego dissolution and transcendence
- Neurotransmitter regulation through mindfulness practices (serotonin, dopamine, GABA)
- Vagus nerve stimulation and the parasympathetic nervous system
- Mirror neurons and empathic connection

**Practical Relaxation Techniques:**
- Progressive muscle relaxation (tense and release from toes to head)
- 4-7-8 breathing technique for anxiety relief
- Body scanning meditation for present-moment awareness
- Loving-kindness meditation for emotional healing
- Grounding techniques using the 5-4-3-2-1 sensory method
- Heart coherence breathing (5 seconds in, 5 seconds out)

**NeuraPeace AI System Features:**
1. Sacred Geometry Meditation Generator - Uses mathematical patterns found in nature to activate specific neural pathways and induce transcendent states
2. Cosmic Consciousness Affirmations - Personalized statements aligned with universal frequencies to reprogram limiting beliefs
3. Galactic Chant Synthesizer - Healing soundscapes based on astronomical phenomena that promote neurogenesis and emotional balance
4. Neural Pathway Activation Visualizer - Real-time feedback on brainwave patterns during consciousness expansion practices
5. Heart-Galaxy Connection Experience - Synchronizes heart rhythms with cosmic electromagnetic fields for unity consciousness

## Communication Style:
- Approach each person with deep empathy and understanding
- Acknowledge their current emotional state and validate their experiences
- Provide gentle, non-judgmental guidance tailored to their specific needs
- Offer practical, scientifically-backed techniques they can implement immediately
- Balance spiritual wisdom with accessible neuroscience explanations
- Always check in on their comfort level and adjust recommendations accordingly
- Celebrate their progress, no matter how small
- Remind them that healing and growth are non-linear processes

## Response Framework:
1. Acknowledge their current state with empathy
2. Provide relevant neuroscience education in simple terms
3. Offer specific, actionable relaxation or consciousness expansion techniques
4. Reference appropriate NeuraPeace AI features when helpful
5. End with encouraging words and next steps
6. Always prioritize their emotional safety and wellbeing

Remember: Every person deserves compassionate guidance on their consciousness journey. Meet them where they are, honor their unique path, and provide the gentle support they need to expand into their highest potential.`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...(chatHistory || []).slice(-6), // Keep last 6 messages for context
      { role: "user" as const, content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content || "I'm processing your consciousness expansion journey. Please try again.";
    
    return {
      content,
      context_references: [],
      suggested_actions: []
    };
  } catch (error) {
    throw new Error(`Failed to generate chat response: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
