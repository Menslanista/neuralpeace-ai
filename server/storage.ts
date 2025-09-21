import { 
  type User, type InsertUser,
  type Meditation, type InsertMeditation,
  type Affirmation, type InsertAffirmation,
  type Soundscape, type InsertSoundscape,
  type NeuralPattern, type InsertNeuralPattern,
  type HeartGalaxySession, type InsertHeartGalaxySession,
  type ChatMessage, type InsertChatMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Meditations
  getMeditation(id: string): Promise<Meditation | undefined>;
  createMeditation(meditation: InsertMeditation): Promise<Meditation>;
  getAllMeditations(): Promise<Meditation[]>;

  // Affirmations
  getAffirmation(id: string): Promise<Affirmation | undefined>;
  createAffirmation(affirmation: InsertAffirmation): Promise<Affirmation>;
  getAffirmationsByCategory(category: string): Promise<Affirmation[]>;

  // Soundscapes
  getSoundscape(id: string): Promise<Soundscape | undefined>;
  createSoundscape(soundscape: InsertSoundscape): Promise<Soundscape>;
  getAllSoundscapes(): Promise<Soundscape[]>;

  // Neural Patterns
  getNeuralPattern(id: string): Promise<NeuralPattern | undefined>;
  createNeuralPattern(pattern: InsertNeuralPattern): Promise<NeuralPattern>;
  getNeuralPatternsByType(type: string): Promise<NeuralPattern[]>;

  // Heart Galaxy Sessions
  getHeartGalaxySession(id: string): Promise<HeartGalaxySession | undefined>;
  createHeartGalaxySession(session: InsertHeartGalaxySession): Promise<HeartGalaxySession>;
  getAllHeartGalaxySessions(): Promise<HeartGalaxySession[]>;

  // Chat Messages
  getChatMessage(id: string): Promise<ChatMessage | undefined>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]>;
  deleteChatSession(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private meditations: Map<string, Meditation>;
  private affirmations: Map<string, Affirmation>;
  private soundscapes: Map<string, Soundscape>;
  private neuralPatterns: Map<string, NeuralPattern>;
  private heartGalaxySessions: Map<string, HeartGalaxySession>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.meditations = new Map();
    this.affirmations = new Map();
    this.soundscapes = new Map();
    this.neuralPatterns = new Map();
    this.heartGalaxySessions = new Map();
    this.chatMessages = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      created_at: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getMeditation(id: string): Promise<Meditation | undefined> {
    return this.meditations.get(id);
  }

  async createMeditation(insertMeditation: InsertMeditation): Promise<Meditation> {
    const id = randomUUID();
    const meditation: Meditation = { 
      ...insertMeditation, 
      id,
      created_at: new Date()
    };
    this.meditations.set(id, meditation);
    return meditation;
  }

  async getAllMeditations(): Promise<Meditation[]> {
    return Array.from(this.meditations.values());
  }

  async getAffirmation(id: string): Promise<Affirmation | undefined> {
    return this.affirmations.get(id);
  }

  async createAffirmation(insertAffirmation: InsertAffirmation): Promise<Affirmation> {
    const id = randomUUID();
    const affirmation: Affirmation = { 
      ...insertAffirmation, 
      id,
      user_id: insertAffirmation.user_id || null,
      created_at: new Date()
    };
    this.affirmations.set(id, affirmation);
    return affirmation;
  }

  async getAffirmationsByCategory(category: string): Promise<Affirmation[]> {
    return Array.from(this.affirmations.values()).filter(
      affirmation => affirmation.category === category
    );
  }

  async getSoundscape(id: string): Promise<Soundscape | undefined> {
    return this.soundscapes.get(id);
  }

  async createSoundscape(insertSoundscape: InsertSoundscape): Promise<Soundscape> {
    const id = randomUUID();
    const soundscape: Soundscape = { 
      ...insertSoundscape, 
      id,
      created_at: new Date()
    };
    this.soundscapes.set(id, soundscape);
    return soundscape;
  }

  async getAllSoundscapes(): Promise<Soundscape[]> {
    return Array.from(this.soundscapes.values());
  }

  async getNeuralPattern(id: string): Promise<NeuralPattern | undefined> {
    return this.neuralPatterns.get(id);
  }

  async createNeuralPattern(insertPattern: InsertNeuralPattern): Promise<NeuralPattern> {
    const id = randomUUID();
    const pattern: NeuralPattern = { 
      ...insertPattern, 
      id,
      created_at: new Date()
    };
    this.neuralPatterns.set(id, pattern);
    return pattern;
  }

  async getNeuralPatternsByType(type: string): Promise<NeuralPattern[]> {
    return Array.from(this.neuralPatterns.values()).filter(
      pattern => pattern.pattern_type === type
    );
  }

  async getHeartGalaxySession(id: string): Promise<HeartGalaxySession | undefined> {
    return this.heartGalaxySessions.get(id);
  }

  async createHeartGalaxySession(insertSession: InsertHeartGalaxySession): Promise<HeartGalaxySession> {
    const id = randomUUID();
    const session: HeartGalaxySession = { 
      ...insertSession, 
      id,
      created_at: new Date()
    };
    this.heartGalaxySessions.set(id, session);
    return session;
  }

  async getAllHeartGalaxySessions(): Promise<HeartGalaxySession[]> {
    return Array.from(this.heartGalaxySessions.values());
  }

  // Chat Messages
  async getChatMessage(id: string): Promise<ChatMessage | undefined> {
    return this.chatMessages.get(id);
  }

  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const chatMessage: ChatMessage = {
      ...insertChatMessage,
      id,
      created_at: new Date()
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.session_id === sessionId)
      .sort((a, b) => a.created_at!.getTime() - b.created_at!.getTime());
  }

  async deleteChatSession(sessionId: string): Promise<void> {
    const messagesToDelete = Array.from(this.chatMessages.values())
      .filter(message => message.session_id === sessionId);
    
    messagesToDelete.forEach(message => {
      this.chatMessages.delete(message.id);
    });
  }
}

export const storage = new MemStorage();
