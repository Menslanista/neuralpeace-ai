import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, index, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User preferences for personalized meditation experiences
export const user_preferences = pgTable("user_preferences", {
  user_id: varchar("user_id").primaryKey().notNull(),
  default_duration: integer("default_duration").default(1260), // 21 minutes
  consciousness_level: text("consciousness_level").default("theta_gamma_sync"),
  breath_pace_bpm: integer("breath_pace_bpm").default(6), // breaths per minute
  guidance_voice: text("guidance_voice").default("neutral"),
  volume: integer("volume").default(70), // 0-100
  theme: text("theme").default("cosmic"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Chat sessions (user-scoped)
export const chat_sessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar("user_id").notNull(),
  title: text("title"),
  created_at: timestamp("created_at").defaultNow(),
  last_activity_at: timestamp("last_activity_at").defaultNow(),
});

// Meditation sessions for tracking user meditation experiences
export const meditation_sessions = pgTable("meditation_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar("user_id").notNull(),
  meditation_id: varchar("meditation_id"), // nullable for custom sessions
  soundscape_id: varchar("soundscape_id"),
  neural_pattern_id: varchar("neural_pattern_id"),
  status: text("status").notNull().default("draft"), // 'draft', 'running', 'paused', 'completed', 'aborted'
  started_at: timestamp("started_at"),
  ended_at: timestamp("ended_at"),
  target_duration: integer("target_duration").notNull(),
  actual_duration: integer("actual_duration"),
  current_phase: text("current_phase"), // 'preparation', 'induction', 'deepening', 'expansion', 'integration'
  intensity: integer("intensity").default(5), // 1-10 scale
  user_rating: integer("user_rating"), // 1-5 stars
  notes: text("notes"),
  config: jsonb("config"), // session configuration and parameters
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Meditation session events for tracking real-time progress
export const meditation_session_events = pgTable("meditation_session_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  meditation_session_id: varchar("meditation_session_id").notNull(),
  event_type: text("event_type").notNull(), // 'phase_change', 'pause', 'resume', 'heart_rate', 'coherence_update', 'user_feedback'
  payload: jsonb("payload"), // event-specific data
  timestamp: timestamp("timestamp").defaultNow(),
});

// User favorites for liked meditations, soundscapes, etc.
export const user_favorites = pgTable("user_favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar("user_id").notNull(),
  entity_type: text("entity_type").notNull(), // 'meditation', 'soundscape', 'affirmation', 'pattern'
  entity_id: varchar("entity_id").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const meditations = pgTable("meditations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pattern: text("pattern").notNull(),
  duration: integer("duration").notNull(),
  frequencies: jsonb("frequencies").notNull(),
  geometry_sequence: jsonb("geometry_sequence").notNull(),
  neural_targets: jsonb("neural_targets").notNull(),
  consciousness_level: text("consciousness_level").notNull(),
  awakening_code: text("awakening_code").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const affirmations = pgTable("affirmations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  category: text("category").notNull(),
  vibrational_frequency: integer("vibrational_frequency").notNull(),
  cosmic_alignment: text("cosmic_alignment").notNull(),
  user_id: varchar("user_id"),
  created_at: timestamp("created_at").defaultNow(),
});

export const soundscapes = pgTable("soundscapes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  frequencies: jsonb("frequencies").notNull(),
  duration: integer("duration").notNull(),
  galactic_type: text("galactic_type").notNull(),
  audio_params: jsonb("audio_params").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const neural_patterns = pgTable("neural_patterns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pattern_type: text("pattern_type").notNull(),
  brain_waves: jsonb("brain_waves").notNull(),
  visualization_data: jsonb("visualization_data").notNull(),
  activation_sequence: jsonb("activation_sequence").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const heart_galaxy_sessions = pgTable("heart_galaxy_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar("user_id").notNull(),
  meditation_session_id: varchar("meditation_session_id"), // link to meditation session
  heart_rate: integer("heart_rate").notNull(),
  coherence_level: integer("coherence_level").notNull(),
  galaxy_sync_status: text("galaxy_sync_status").notNull(),
  cosmic_coordinates: jsonb("cosmic_coordinates").notNull(),
  session_duration: integer("session_duration").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const chat_messages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chat_session_id: varchar("chat_session_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(user_preferences).omit({
  created_at: true,
  updated_at: true,
});

export const insertChatSessionSchema = createInsertSchema(chat_sessions).omit({
  id: true,
  created_at: true,
  last_activity_at: true,
});

export const insertMeditationSchema = createInsertSchema(meditations).omit({
  id: true,
  created_at: true,
});

export const insertMeditationSessionSchema = createInsertSchema(meditation_sessions).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertMeditationSessionEventSchema = createInsertSchema(meditation_session_events).omit({
  id: true,
  timestamp: true,
});

export const insertUserFavoriteSchema = createInsertSchema(user_favorites).omit({
  id: true,
  created_at: true,
});

export const insertAffirmationSchema = createInsertSchema(affirmations).omit({
  id: true,
  created_at: true,
});

export const insertSoundscapeSchema = createInsertSchema(soundscapes).omit({
  id: true,
  created_at: true,
});

export const insertNeuralPatternSchema = createInsertSchema(neural_patterns).omit({
  id: true,
  created_at: true,
});

export const insertHeartGalaxySessionSchema = createInsertSchema(heart_galaxy_sessions).omit({
  id: true,
  created_at: true,
});

export const insertChatMessageSchema = createInsertSchema(chat_messages).omit({
  id: true,
  created_at: true,
});

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;

export type UserPreferences = typeof user_preferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

export type ChatSession = typeof chat_sessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;

export type MeditationSession = typeof meditation_sessions.$inferSelect;
export type InsertMeditationSession = z.infer<typeof insertMeditationSessionSchema>;

export type MeditationSessionEvent = typeof meditation_session_events.$inferSelect;
export type InsertMeditationSessionEvent = z.infer<typeof insertMeditationSessionEventSchema>;

export type UserFavorite = typeof user_favorites.$inferSelect;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;

export type Meditation = typeof meditations.$inferSelect;
export type InsertMeditation = z.infer<typeof insertMeditationSchema>;

export type Affirmation = typeof affirmations.$inferSelect;
export type InsertAffirmation = z.infer<typeof insertAffirmationSchema>;

export type Soundscape = typeof soundscapes.$inferSelect;
export type InsertSoundscape = z.infer<typeof insertSoundscapeSchema>;

export type NeuralPattern = typeof neural_patterns.$inferSelect;
export type InsertNeuralPattern = z.infer<typeof insertNeuralPatternSchema>;

export type HeartGalaxySession = typeof heart_galaxy_sessions.$inferSelect;
export type InsertHeartGalaxySession = z.infer<typeof insertHeartGalaxySessionSchema>;

export type ChatMessage = typeof chat_messages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
