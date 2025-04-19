import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Quotes table for daily cosmic quotes
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  author: text("author").notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Journal entries table
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  text: text("text").notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Celestial objects table
export const celestialObjects = pgTable("celestial_objects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: varchar("type", { length: 20 }).notNull().$type<"planet" | "galaxy" | "nebula" | "exoplanet">(), // planet, galaxy, nebula, exoplanet
  image: text("image").notNull(),
  description: text("description").notNull(),
  scientificData: jsonb("scientific_data"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Cosmic patterns table for the random generator
export const cosmicPatterns = pgTable("cosmic_patterns", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  question: text("question").notNull(),
  affirmation: text("affirmation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Cosmic sounds table
export const cosmicSounds = pgTable("cosmic_sounds", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  audioUrl: text("audio_url").notNull(),
  duration: integer("duration"), // in seconds
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Quiz questions table
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Quiz results table
export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  archetype: text("archetype").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).pick({
  text: true,
  author: true,
  tags: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).pick({
  userId: true,
  text: true,
  tags: true,
});

export const insertCelestialObjectSchema = createInsertSchema(celestialObjects).pick({
  name: true,
  type: true,
  image: true,
  description: true,
  scientificData: true,
});

export const insertCosmicPatternSchema = createInsertSchema(cosmicPatterns).pick({
  image: true,
  question: true,
  affirmation: true,
});

export const insertCosmicSoundSchema = createInsertSchema(cosmicSounds).pick({
  title: true,
  description: true,
  audioUrl: true,
  duration: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  question: true,
  options: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).pick({
  title: true,
  description: true,
  archetype: true,
});

// Define relations between tables
export const usersRelations = relations(users, ({ many }) => ({
  journalEntries: many(journalEntries),
}));

export const journalEntriesRelations = relations(journalEntries, ({ one }) => ({
  user: one(users, {
    fields: [journalEntries.userId],
    references: [users.id],
  }),
}));

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;

export type InsertCelestialObject = z.infer<typeof insertCelestialObjectSchema>;
export type CelestialObject = typeof celestialObjects.$inferSelect;

export type InsertCosmicPattern = z.infer<typeof insertCosmicPatternSchema>;
export type CosmicPattern = typeof cosmicPatterns.$inferSelect;

export type InsertCosmicSound = z.infer<typeof insertCosmicSoundSchema>;
export type CosmicSound = typeof cosmicSounds.$inferSelect;

export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;

export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type QuizResult = typeof quizResults.$inferSelect;
