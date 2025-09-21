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

export async function generateSacredGeometryMeditation(
  intention?: string,
  duration: number = 1260
): Promise<MeditationData> {
  try {
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
