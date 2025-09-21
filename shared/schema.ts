import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
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
  heart_rate: integer("heart_rate").notNull(),
  coherence_level: integer("coherence_level").notNull(),
  galaxy_sync_status: text("galaxy_sync_status").notNull(),
  cosmic_coordinates: jsonb("cosmic_coordinates").notNull(),
  session_duration: integer("session_duration").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
});

export const insertMeditationSchema = createInsertSchema(meditations).omit({
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

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

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
