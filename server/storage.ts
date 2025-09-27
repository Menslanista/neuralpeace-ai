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
  updateMeditationSession(sessionId: string, updates: Partial<MeditationSession>): Promise<MeditationSession>;
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
  
  // Enhanced Meditation Session Methods  
  getActiveMeditationSession(userId: string): Promise<MeditationSession | null>;
}

import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import {
  users,
  user_preferences,
  chat_sessions,
  meditation_sessions,
  meditation_session_events,
  user_favorites,
  meditations,
  affirmations,
  soundscapes,
  neural_patterns,
  heart_galaxy_sessions,
  chat_messages
} from "@shared/schema";

export class DatabaseStorage implements IStorage {
  constructor() {
    // Database storage doesn't need initialization
  }

  // Users (required by Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = await this.getUser(userData.id!);
    
    if (existingUser) {
      const [updatedUser] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date()
        })
        .where(eq(users.id, userData.id!))
        .returning();
      return updatedUser;
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          id: userData.id || randomUUID(),
          email: userData.email || null,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          profileImageUrl: userData.profileImageUrl || null,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return newUser;
    }
  }

  // User Preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [prefs] = await db.select().from(user_preferences).where(eq(user_preferences.user_id, userId));
    return prefs || undefined;
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [userPrefs] = await db
      .insert(user_preferences)
      .values({
        user_id: preferences.user_id,
        default_duration: preferences.default_duration || null,
        consciousness_level: preferences.consciousness_level || null,
        breath_pace_bpm: preferences.breath_pace_bpm || null,
        guidance_voice: preferences.guidance_voice || null,
        volume: preferences.volume || null,
        theme: preferences.theme || null,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning();
    return userPrefs;
  }

  async updateUserPreferences(userId: string, updates: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined> {
    const [updated] = await db
      .update(user_preferences)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(user_preferences.user_id, userId))
      .returning();
    return updated || undefined;
  }

  // Chat Sessions
  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chat_sessions).where(eq(chat_sessions.id, id));
    return session || undefined;
  }

  async createChatSession(sessionData: InsertChatSession): Promise<ChatSession> {
    const [session] = await db
      .insert(chat_sessions)
      .values({
        id: randomUUID(),
        user_id: sessionData.user_id,
        title: sessionData.title || null,
        created_at: new Date(),
        last_activity_at: new Date()
      })
      .returning();
    return session;
  }

  async getChatSessionsByUser(userId: string): Promise<ChatSession[]> {
    return await db
      .select()
      .from(chat_sessions)
      .where(eq(chat_sessions.user_id, userId))
      .orderBy(desc(chat_sessions.last_activity_at));
  }

  async updateChatSessionActivity(sessionId: string): Promise<void> {
    await db
      .update(chat_sessions)
      .set({ last_activity_at: new Date() })
      .where(eq(chat_sessions.id, sessionId));
  }

  async deleteChatSession(sessionId: string): Promise<void> {
    // Delete associated messages first
    await db.delete(chat_messages).where(eq(chat_messages.chat_session_id, sessionId));
    
    // Delete chat session
    await db.delete(chat_sessions).where(eq(chat_sessions.id, sessionId));
  }

  // Meditation Sessions
  async getMeditationSession(id: string): Promise<MeditationSession | undefined> {
    const [session] = await db.select().from(meditation_sessions).where(eq(meditation_sessions.id, id));
    return session || undefined;
  }

  async createMeditationSession(sessionData: InsertMeditationSession): Promise<MeditationSession> {
    const [session] = await db
      .insert(meditation_sessions)
      .values({
        id: randomUUID(),
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
      })
      .returning();
    return session;
  }

  async getMeditationSessionsByStatus(userId: string, status: string): Promise<MeditationSession[]> {
    return await db
      .select()
      .from(meditation_sessions)
      .where(
        and(
          eq(meditation_sessions.user_id, userId),
          eq(meditation_sessions.status, status)
        )
      );
  }

  // Meditation Session Events
  async createMeditationSessionEvent(eventData: InsertMeditationSessionEvent): Promise<MeditationSessionEvent> {
    const [event] = await db
      .insert(meditation_session_events)
      .values({
        id: randomUUID(),
        meditation_session_id: eventData.meditation_session_id,
        event_type: eventData.event_type,
        payload: eventData.payload || null,
        timestamp: new Date()
      })
      .returning();
    return event;
  }

  async getMeditationSessionEvents(sessionId: string): Promise<MeditationSessionEvent[]> {
    return await db
      .select()
      .from(meditation_session_events)
      .where(eq(meditation_session_events.meditation_session_id, sessionId))
      .orderBy(meditation_session_events.timestamp);
  }

  // User Favorites
  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    return await db
      .select()
      .from(user_favorites)
      .where(eq(user_favorites.user_id, userId));
  }

  async createUserFavorite(favoriteData: InsertUserFavorite): Promise<UserFavorite> {
    const [favorite] = await db
      .insert(user_favorites)
      .values({
        id: randomUUID(),
        user_id: favoriteData.user_id,
        entity_type: favoriteData.entity_type,
        entity_id: favoriteData.entity_id,
        created_at: new Date()
      })
      .returning();
    return favorite;
  }

  async deleteUserFavorite(userId: string, entityType: string, entityId: string): Promise<void> {
    await db
      .delete(user_favorites)
      .where(
        and(
          eq(user_favorites.user_id, userId),
          eq(user_favorites.entity_type, entityType),
          eq(user_favorites.entity_id, entityId)
        )
      );
  }

  async isUserFavorite(userId: string, entityType: string, entityId: string): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(user_favorites)
      .where(
        and(
          eq(user_favorites.user_id, userId),
          eq(user_favorites.entity_type, entityType),
          eq(user_favorites.entity_id, entityId)
        )
      );
    return !!favorite;
  }

  async getMeditation(id: string): Promise<Meditation | undefined> {
    const [meditation] = await db.select().from(meditations).where(eq(meditations.id, id));
    return meditation || undefined;
  }

  async createMeditation(insertMeditation: InsertMeditation): Promise<Meditation> {
    const [meditation] = await db
      .insert(meditations)
      .values({
        id: randomUUID(),
        pattern: insertMeditation.pattern,
        duration: insertMeditation.duration,
        frequencies: insertMeditation.frequencies,
        geometry_sequence: insertMeditation.geometry_sequence,
        neural_targets: insertMeditation.neural_targets,
        consciousness_level: insertMeditation.consciousness_level,
        awakening_code: insertMeditation.awakening_code,
        created_at: new Date()
      })
      .returning();
    return meditation;
  }

  async getAllMeditations(): Promise<Meditation[]> {
    return await db.select().from(meditations);
  }

  async getAffirmation(id: string): Promise<Affirmation | undefined> {
    const [affirmation] = await db.select().from(affirmations).where(eq(affirmations.id, id));
    return affirmation || undefined;
  }

  async createAffirmation(insertAffirmation: InsertAffirmation): Promise<Affirmation> {
    const [affirmation] = await db
      .insert(affirmations)
      .values({
        id: randomUUID(),
        user_id: insertAffirmation.user_id || null,
        text: insertAffirmation.text,
        category: insertAffirmation.category,
        vibrational_frequency: insertAffirmation.vibrational_frequency,
        cosmic_alignment: insertAffirmation.cosmic_alignment,
        created_at: new Date()
      })
      .returning();
    return affirmation;
  }

  async getAffirmationsByCategory(category: string): Promise<Affirmation[]> {
    return await db
      .select()
      .from(affirmations)
      .where(eq(affirmations.category, category));
  }

  async getAffirmationsByUser(userId: string): Promise<Affirmation[]> {
    return await db
      .select()
      .from(affirmations)
      .where(eq(affirmations.user_id, userId));
  }

  async getSoundscape(id: string): Promise<Soundscape | undefined> {
    const [soundscape] = await db.select().from(soundscapes).where(eq(soundscapes.id, id));
    return soundscape || undefined;
  }

  async createSoundscape(insertSoundscape: InsertSoundscape): Promise<Soundscape> {
    const [soundscape] = await db
      .insert(soundscapes)
      .values({
        id: randomUUID(),
        name: insertSoundscape.name,
        frequencies: insertSoundscape.frequencies,
        duration: insertSoundscape.duration,
        galactic_type: insertSoundscape.galactic_type,
        audio_params: insertSoundscape.audio_params,
        created_at: new Date()
      })
      .returning();
    return soundscape;
  }

  async getAllSoundscapes(): Promise<Soundscape[]> {
    return await db.select().from(soundscapes);
  }

  async getNeuralPattern(id: string): Promise<NeuralPattern | undefined> {
    const [pattern] = await db.select().from(neural_patterns).where(eq(neural_patterns.id, id));
    return pattern || undefined;
  }

  async createNeuralPattern(insertPattern: InsertNeuralPattern): Promise<NeuralPattern> {
    const [pattern] = await db
      .insert(neural_patterns)
      .values({
        id: randomUUID(),
        pattern_type: insertPattern.pattern_type,
        brain_waves: insertPattern.brain_waves,
        visualization_data: insertPattern.visualization_data,
        activation_sequence: insertPattern.activation_sequence,
        created_at: new Date()
      })
      .returning();
    return pattern;
  }

  async getNeuralPatternsByType(type: string): Promise<NeuralPattern[]> {
    return await db
      .select()
      .from(neural_patterns)
      .where(eq(neural_patterns.pattern_type, type));
  }

  async getHeartGalaxySession(id: string): Promise<HeartGalaxySession | undefined> {
    const [session] = await db.select().from(heart_galaxy_sessions).where(eq(heart_galaxy_sessions.id, id));
    return session || undefined;
  }

  async createHeartGalaxySession(insertSession: InsertHeartGalaxySession): Promise<HeartGalaxySession> {
    const [session] = await db
      .insert(heart_galaxy_sessions)
      .values({
        id: randomUUID(),
        user_id: insertSession.user_id,
        meditation_session_id: insertSession.meditation_session_id || null,
        heart_rate: insertSession.heart_rate,
        coherence_level: insertSession.coherence_level,
        galaxy_sync_status: insertSession.galaxy_sync_status,
        cosmic_coordinates: insertSession.cosmic_coordinates,
        session_duration: insertSession.session_duration,
        created_at: new Date()
      })
      .returning();
    return session;
  }

  async getHeartGalaxySessionsByUser(userId: string): Promise<HeartGalaxySession[]> {
    return await db
      .select()
      .from(heart_galaxy_sessions)
      .where(eq(heart_galaxy_sessions.user_id, userId));
  }

  // Chat Messages
  async getChatMessage(id: string): Promise<ChatMessage | undefined> {
    const [message] = await db.select().from(chat_messages).where(eq(chat_messages.id, id));
    return message || undefined;
  }

  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chat_messages)
      .values({
        id: randomUUID(),
        chat_session_id: insertChatMessage.chat_session_id,
        role: insertChatMessage.role,
        content: insertChatMessage.content,
        created_at: new Date()
      })
      .returning();
    return chatMessage;
  }

  async getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chat_messages)
      .where(eq(chat_messages.chat_session_id, sessionId))
      .orderBy(chat_messages.created_at);
  }

  // Enhanced meditation session methods for phase-based engine
  async updateMeditationSession(sessionId: string, updates: Partial<MeditationSession>): Promise<MeditationSession> {
    const [updatedSession] = await db
      .update(meditation_sessions)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(meditation_sessions.id, sessionId))
      .returning();
    
    if (!updatedSession) {
      throw new Error(`Meditation session ${sessionId} not found`);
    }
    
    return updatedSession;
  }

  async getMeditationSessionsByUser(userId: string): Promise<MeditationSession[]> {
    return await db
      .select()
      .from(meditation_sessions)
      .where(eq(meditation_sessions.user_id, userId))
      .orderBy(desc(meditation_sessions.created_at));
  }

  async getActiveMeditationSession(userId: string): Promise<MeditationSession | null> {
    const [session] = await db
      .select()
      .from(meditation_sessions)
      .where(
        and(
          eq(meditation_sessions.user_id, userId),
          eq(meditation_sessions.status, "running")
        )
      )
      .limit(1);
    return session || null;
  }
}

export const storage = new DatabaseStorage();
