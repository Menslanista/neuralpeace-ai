import { 
  type User, type UpsertUser,
  type UserPreferences, type InsertUserPreferences,
  type ChatSession, type InsertChatSession,
  type MeditationSession, type InsertMeditationSession,
  type MeditationSessionEvent, type InsertMeditationSessionEvent,
  type UserFavorite, type InsertUserFavorite,
  type Meditation, type InsertMeditation,
  type Affirmation, type InsertAffirmation,
  type Soundscape, type InsertSoundscape,
  type NeuralPattern, type InsertNeuralPattern,
  type HeartGalaxySession, type InsertHeartGalaxySession,
  type ChatMessage, type InsertChatMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users (required by Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // User Preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined>;

  // Chat Sessions
  getChatSession(id: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSessionsByUser(userId: string): Promise<ChatSession[]>;
  updateChatSessionActivity(sessionId: string): Promise<void>;
  deleteChatSession(sessionId: string): Promise<void>;

  // Meditation Sessions
  getMeditationSession(id: string): Promise<MeditationSession | undefined>;
  createMeditationSession(session: InsertMeditationSession): Promise<MeditationSession>;
  updateMeditationSession(id: string, updates: Partial<InsertMeditationSession>): Promise<MeditationSession | undefined>;
  getMeditationSessionsByUser(userId: string): Promise<MeditationSession[]>;
  getMeditationSessionsByStatus(userId: string, status: string): Promise<MeditationSession[]>;

  // Meditation Session Events
  createMeditationSessionEvent(event: InsertMeditationSessionEvent): Promise<MeditationSessionEvent>;
  getMeditationSessionEvents(sessionId: string): Promise<MeditationSessionEvent[]>;

  // User Favorites
  getUserFavorites(userId: string): Promise<UserFavorite[]>;
  createUserFavorite(favorite: InsertUserFavorite): Promise<UserFavorite>;
  deleteUserFavorite(userId: string, entityType: string, entityId: string): Promise<void>;
  isUserFavorite(userId: string, entityType: string, entityId: string): Promise<boolean>;

  // Meditations
  getMeditation(id: string): Promise<Meditation | undefined>;
  createMeditation(meditation: InsertMeditation): Promise<Meditation>;
  getAllMeditations(): Promise<Meditation[]>;

  // Affirmations
  getAffirmation(id: string): Promise<Affirmation | undefined>;
  createAffirmation(affirmation: InsertAffirmation): Promise<Affirmation>;
  getAffirmationsByCategory(category: string): Promise<Affirmation[]>;
  getAffirmationsByUser(userId: string): Promise<Affirmation[]>;

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
  getHeartGalaxySessionsByUser(userId: string): Promise<HeartGalaxySession[]>;

  // Chat Messages
  getChatMessage(id: string): Promise<ChatMessage | undefined>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userPreferences: Map<string, UserPreferences>;
  private chatSessions: Map<string, ChatSession>;
  private meditationSessions: Map<string, MeditationSession>;
  private meditationSessionEvents: Map<string, MeditationSessionEvent>;
  private userFavorites: Map<string, UserFavorite>;
  private meditations: Map<string, Meditation>;
  private affirmations: Map<string, Affirmation>;
  private soundscapes: Map<string, Soundscape>;
  private neuralPatterns: Map<string, NeuralPattern>;
  private heartGalaxySessions: Map<string, HeartGalaxySession>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.userPreferences = new Map();
    this.chatSessions = new Map();
    this.meditationSessions = new Map();
    this.meditationSessionEvents = new Map();
    this.userFavorites = new Map();
    this.meditations = new Map();
    this.affirmations = new Map();
    this.soundscapes = new Map();
    this.neuralPatterns = new Map();
    this.heartGalaxySessions = new Map();
    this.chatMessages = new Map();
  }

  // Users (required by Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    
    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: new Date()
      };
      this.users.set(userData.id!, updatedUser);
      return updatedUser;
    } else {
      const newUser: User = {
        id: userData.id || randomUUID(),
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(newUser.id, newUser);
      return newUser;
    }
  }

  // User Preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return this.userPreferences.get(userId);
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const userPrefs: UserPreferences = {
      user_id: preferences.user_id,
      default_duration: preferences.default_duration || null,
      consciousness_level: preferences.consciousness_level || null,
      breath_pace_bpm: preferences.breath_pace_bpm || null,
      guidance_voice: preferences.guidance_voice || null,
      volume: preferences.volume || null,
      theme: preferences.theme || null,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.userPreferences.set(preferences.user_id, userPrefs);
    return userPrefs;
  }

  async updateUserPreferences(userId: string, updates: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined> {
    const existing = this.userPreferences.get(userId);
    if (existing) {
      const updated: UserPreferences = {
        ...existing,
        ...updates,
        updated_at: new Date()
      };
      this.userPreferences.set(userId, updated);
      return updated;
    }
    return undefined;
  }

  // Chat Sessions
  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async createChatSession(sessionData: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      id,
      user_id: sessionData.user_id,
      title: sessionData.title || null,
      created_at: new Date(),
      last_activity_at: new Date()
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async getChatSessionsByUser(userId: string): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values())
      .filter(session => session.user_id === userId)
      .sort((a, b) => b.last_activity_at!.getTime() - a.last_activity_at!.getTime());
  }

  async updateChatSessionActivity(sessionId: string): Promise<void> {
    const session = this.chatSessions.get(sessionId);
    if (session) {
      session.last_activity_at = new Date();
      this.chatSessions.set(sessionId, session);
    }
  }

  async deleteChatSession(sessionId: string): Promise<void> {
    // Delete chat session
    this.chatSessions.delete(sessionId);
    
    // Delete associated messages
    const messagesToDelete = Array.from(this.chatMessages.values())
      .filter(message => message.chat_session_id === sessionId);
    
    messagesToDelete.forEach(message => {
      this.chatMessages.delete(message.id);
    });
  }

  // Meditation Sessions
  async getMeditationSession(id: string): Promise<MeditationSession | undefined> {
    return this.meditationSessions.get(id);
  }

  async createMeditationSession(sessionData: InsertMeditationSession): Promise<MeditationSession> {
    const id = randomUUID();
    const session: MeditationSession = {
      id,
      user_id: sessionData.user_id,
      meditation_id: sessionData.meditation_id || null,
      soundscape_id: sessionData.soundscape_id || null,
      neural_pattern_id: sessionData.neural_pattern_id || null,
      status: sessionData.status || "draft",
      started_at: sessionData.started_at || null,
      ended_at: sessionData.ended_at || null,
      target_duration: sessionData.target_duration,
      actual_duration: sessionData.actual_duration || null,
      current_phase: sessionData.current_phase || null,
      intensity: sessionData.intensity || null,
      user_rating: sessionData.user_rating || null,
      notes: sessionData.notes || null,
      config: sessionData.config || null,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.meditationSessions.set(id, session);
    return session;
  }

  async updateMeditationSession(id: string, updates: Partial<InsertMeditationSession>): Promise<MeditationSession | undefined> {
    const existing = this.meditationSessions.get(id);
    if (existing) {
      const updated: MeditationSession = {
        ...existing,
        ...updates,
        updated_at: new Date()
      };
      this.meditationSessions.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async getMeditationSessionsByUser(userId: string): Promise<MeditationSession[]> {
    return Array.from(this.meditationSessions.values())
      .filter(session => session.user_id === userId)
      .sort((a, b) => b.created_at!.getTime() - a.created_at!.getTime());
  }

  async getMeditationSessionsByStatus(userId: string, status: string): Promise<MeditationSession[]> {
    return Array.from(this.meditationSessions.values())
      .filter(session => session.user_id === userId && session.status === status);
  }

  // Meditation Session Events
  async createMeditationSessionEvent(eventData: InsertMeditationSessionEvent): Promise<MeditationSessionEvent> {
    const id = randomUUID();
    const event: MeditationSessionEvent = {
      id,
      meditation_session_id: eventData.meditation_session_id,
      event_type: eventData.event_type,
      payload: eventData.payload || null,
      timestamp: new Date()
    };
    this.meditationSessionEvents.set(id, event);
    return event;
  }

  async getMeditationSessionEvents(sessionId: string): Promise<MeditationSessionEvent[]> {
    return Array.from(this.meditationSessionEvents.values())
      .filter(event => event.meditation_session_id === sessionId)
      .sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
  }

  // User Favorites
  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    return Array.from(this.userFavorites.values())
      .filter(favorite => favorite.user_id === userId);
  }

  async createUserFavorite(favoriteData: InsertUserFavorite): Promise<UserFavorite> {
    const id = randomUUID();
    const favorite: UserFavorite = {
      ...favoriteData,
      id,
      created_at: new Date()
    };
    this.userFavorites.set(id, favorite);
    return favorite;
  }

  async deleteUserFavorite(userId: string, entityType: string, entityId: string): Promise<void> {
    const favoriteToDelete = Array.from(this.userFavorites.values())
      .find(fav => fav.user_id === userId && fav.entity_type === entityType && fav.entity_id === entityId);
    
    if (favoriteToDelete) {
      this.userFavorites.delete(favoriteToDelete.id);
    }
  }

  async isUserFavorite(userId: string, entityType: string, entityId: string): Promise<boolean> {
    return Array.from(this.userFavorites.values())
      .some(fav => fav.user_id === userId && fav.entity_type === entityType && fav.entity_id === entityId);
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

  async getAffirmationsByUser(userId: string): Promise<Affirmation[]> {
    return Array.from(this.affirmations.values()).filter(
      affirmation => affirmation.user_id === userId
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
      meditation_session_id: insertSession.meditation_session_id || null,
      id,
      created_at: new Date()
    };
    this.heartGalaxySessions.set(id, session);
    return session;
  }

  async getHeartGalaxySessionsByUser(userId: string): Promise<HeartGalaxySession[]> {
    return Array.from(this.heartGalaxySessions.values())
      .filter(session => session.user_id === userId);
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
      .filter(message => message.chat_session_id === sessionId)
      .sort((a, b) => a.created_at!.getTime() - b.created_at!.getTime());
  }
}

export const storage = new MemStorage();
