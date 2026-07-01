import {
  users, type User, type InsertUser,
  quotes, type Quote, type InsertQuote,
  journalEntries, type JournalEntry, type InsertJournalEntry,
  celestialObjects, type CelestialObject, type InsertCelestialObject,
  cosmicPatterns, type CosmicPattern, type InsertCosmicPattern,
  cosmicSounds, type CosmicSound, type InsertCosmicSound,
  quizQuestions, type QuizQuestion, type InsertQuizQuestion,
  quizResults, type QuizResult, type InsertQuizResult,
  traditions, type Tradition, type InsertTradition,
} from "../../shared/schema";
import { eq, sql } from "drizzle-orm";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";

// Storage interface with CRUD methods for all entities
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSubscription(userId: number, isSubscribed: boolean): Promise<User | undefined>;

  // Quote operations
  getAllQuotes(): Promise<Quote[]>;
  getQuote(id: number): Promise<Quote | undefined>;
  getRandomQuote(): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;

  // Journal entry operations
  getJournalEntriesByUserId(userId: number): Promise<JournalEntry[]>;
  getJournalEntry(id: number): Promise<JournalEntry | undefined>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  updateJournalEntry(id: number, entry: Partial<InsertJournalEntry>): Promise<JournalEntry | undefined>;
  deleteJournalEntry(id: number): Promise<boolean>;

  // Celestial object operations
  getAllCelestialObjects(): Promise<CelestialObject[]>;
  getCelestialObjectsByType(type: string): Promise<CelestialObject[]>;
  getCelestialObject(id: number): Promise<CelestialObject | undefined>;
  createCelestialObject(object: InsertCelestialObject): Promise<CelestialObject>;

  // Cosmic pattern operations
  getAllCosmicPatterns(): Promise<CosmicPattern[]>;
  getCosmicPattern(id: number): Promise<CosmicPattern | undefined>;
  getRandomCosmicPattern(): Promise<CosmicPattern | undefined>;
  createCosmicPattern(pattern: InsertCosmicPattern): Promise<CosmicPattern>;

  // Cosmic sound operations
  getAllCosmicSounds(): Promise<CosmicSound[]>;
  getCosmicSound(id: number): Promise<CosmicSound | undefined>;
  createCosmicSound(sound: InsertCosmicSound): Promise<CosmicSound>;

  // Quiz question operations
  getAllQuizQuestions(): Promise<QuizQuestion[]>;
  getQuizQuestion(id: number): Promise<QuizQuestion | undefined>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;

  // Quiz result operations
  getAllQuizResults(): Promise<QuizResult[]>;
  getQuizResult(id: number): Promise<QuizResult | undefined>;
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;

  // Tradition operations
  getAllTraditions(): Promise<Tradition[]>;
  getTradition(id: number): Promise<Tradition | undefined>;
  getTraditionBySlug(slug: string): Promise<Tradition | undefined>;
  getFeaturedTraditions(): Promise<Tradition[]>;
  createTradition(tradition: InsertTradition): Promise<Tradition>;
}

// --- Memory Storage ---

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private quotes = new Map<number, Quote>();
  private journalEntries = new Map<number, JournalEntry>();
  private celestialObjects = new Map<number, CelestialObject>();
  private cosmicPatterns = new Map<number, CosmicPattern>();
  private cosmicSounds = new Map<number, CosmicSound>();
  private quizQuestions = new Map<number, QuizQuestion>();
  private quizResults = new Map<number, QuizResult>();
  private traditions = new Map<number, Tradition>();

  private ids: Record<string, number> = {
    users: 1, quotes: 1, journalEntries: 1, celestialObjects: 1,
    cosmicPatterns: 1, cosmicSounds: 1, quizQuestions: 1, quizResults: 1, traditions: 1,
  };

  // --- Users ---
  async getUser(id: number) { return this.users.get(id); }
  async getUserByUsername(username: string) {
    return Array.from(this.users.values()).find((u) => u.username === username);
  }
  async getUserByEmail(email: string) {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }
  async createUser(insertUser: InsertUser) {
    const id = this.ids.users++;
    const createdAt = new Date();
    const user: User = {
      ...insertUser,
      id,
      createdAt,
      isSubscribed: false,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };
    this.users.set(id, user);
    return user;
  }
  async updateUserSubscription(userId: number, isSubscribed: boolean) {
    const user = this.users.get(userId);
    if (!user) return undefined;
    const updated = { ...user, isSubscribed };
    this.users.set(userId, updated);
    return updated;
  }

  // --- Quotes ---
  async getAllQuotes() { return Array.from(this.quotes.values()); }
  async getQuote(id: number) { return this.quotes.get(id); }
  async getRandomQuote() {
    const arr = Array.from(this.quotes.values());
    return arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined;
  }
  async createQuote(insert: InsertQuote) {
    const id = this.ids.quotes++;
    const createdAt = new Date();
    const item: Quote = { ...insert, id, createdAt };
    this.quotes.set(id, item);
    return item;
  }

  // --- Journal ---
  async getJournalEntriesByUserId(userId: number) {
    return Array.from(this.journalEntries.values())
      .filter((e) => e.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getJournalEntry(id: number) { return this.journalEntries.get(id); }
  async createJournalEntry(insert: InsertJournalEntry) {
    const id = this.ids.journalEntries++;
    const createdAt = new Date();
    const entry: JournalEntry = { ...insert, id, createdAt };
    this.journalEntries.set(id, entry);
    return entry;
  }
  async updateJournalEntry(id: number, update: Partial<InsertJournalEntry>) {
    const entry = this.journalEntries.get(id);
    if (!entry) return undefined;
    const updated = { ...entry, ...update };
    this.journalEntries.set(id, updated);
    return updated;
  }
  async deleteJournalEntry(id: number) { return this.journalEntries.delete(id); }

  // --- Celestial ---
  async getAllCelestialObjects() { return Array.from(this.celestialObjects.values()); }
  async getCelestialObjectsByType(type: string) {
    return Array.from(this.celestialObjects.values()).filter((o) => o.type.toLowerCase() === type.toLowerCase());
  }
  async getCelestialObject(id: number) { return this.celestialObjects.get(id); }
  async createCelestialObject(insert: InsertCelestialObject) {
    const id = this.ids.celestialObjects++;
    const createdAt = new Date();
    const item: CelestialObject = { ...insert, id, createdAt };
    this.celestialObjects.set(id, item);
    return item;
  }

  // --- Cosmic Patterns ---
  async getAllCosmicPatterns() { return Array.from(this.cosmicPatterns.values()); }
  async getCosmicPattern(id: number) { return this.cosmicPatterns.get(id); }
  async getRandomCosmicPattern() {
    const arr = Array.from(this.cosmicPatterns.values());
    return arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined;
  }
  async createCosmicPattern(insert: InsertCosmicPattern) {
    const id = this.ids.cosmicPatterns++;
    const createdAt = new Date();
    const item: CosmicPattern = { ...insert, id, createdAt };
    this.cosmicPatterns.set(id, item);
    return item;
  }

  // --- Cosmic Sounds ---
  async getAllCosmicSounds() { return Array.from(this.cosmicSounds.values()); }
  async getCosmicSound(id: number) { return this.cosmicSounds.get(id); }
  async createCosmicSound(insert: InsertCosmicSound) {
    const id = this.ids.cosmicSounds++;
    const createdAt = new Date();
    const item: CosmicSound = { ...insert, id, createdAt };
    this.cosmicSounds.set(id, item);
    return item;
  }

  // --- Quiz Questions ---
  async getAllQuizQuestions() { return Array.from(this.quizQuestions.values()); }
  async getQuizQuestion(id: number) { return this.quizQuestions.get(id); }
  async createQuizQuestion(insert: InsertQuizQuestion) {
    const id = this.ids.quizQuestions++;
    const createdAt = new Date();
    const item: QuizQuestion = { ...insert, id, createdAt };
    this.quizQuestions.set(id, item);
    return item;
  }

  // --- Quiz Results ---
  async getAllQuizResults() { return Array.from(this.quizResults.values()); }
  async getQuizResult(id: number) { return this.quizResults.get(id); }
  async createQuizResult(insert: InsertQuizResult) {
    const id = this.ids.quizResults++;
    const createdAt = new Date();
    const item: QuizResult = { ...insert, id, createdAt };
    this.quizResults.set(id, item);
    return item;
  }

  // --- Traditions ---
  async getAllTraditions() { return Array.from(this.traditions.values()); }
  async getTradition(id: number) { return this.traditions.get(id); }
  async getTraditionBySlug(slug: string) {
    return Array.from(this.traditions.values()).find((t) => t.slug === slug);
  }
  async getFeaturedTraditions() {
    return Array.from(this.traditions.values()).filter((t) => t.featured);
  }
  async createTradition(insert: InsertTradition) {
    const id = this.ids.traditions++;
    const createdAt = new Date();
    const item: Tradition = { ...insert, id, createdAt, updatedAt: createdAt };
    this.traditions.set(id, item);
    return item;
  }
}

// --- Database Storage ---

export class DatabaseStorage implements IStorage {
  constructor(private db: NeonDatabase<typeof import("../../shared/schema")>) {}

  // --- Users ---
  async getUser(id: number) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username: string) {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async getUserByEmail(email: string) {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createUser(insertUser: InsertUser) {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUserSubscription(userId: number, isSubscribed: boolean) {
    const [user] = await this.db
      .update(users).set({ isSubscribed }).where(eq(users.id, userId)).returning();
    return user;
  }

  // --- Quotes ---
  async getAllQuotes() { return this.db.select().from(quotes); }
  async getQuote(id: number) {
    const [r] = await this.db.select().from(quotes).where(eq(quotes.id, id));
    return r;
  }
  async getRandomQuote() {
    const [r] = await this.db.select().from(quotes).orderBy(sql`RANDOM()`).limit(1);
    return r;
  }
  async createQuote(insert: InsertQuote) {
    const [r] = await this.db.insert(quotes).values(insert).returning();
    return r;
  }

  // --- Journal ---
  async getJournalEntriesByUserId(userId: number) {
    return this.db.select().from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(journalEntries.createdAt);
  }
  async getJournalEntry(id: number) {
    const [r] = await this.db.select().from(journalEntries).where(eq(journalEntries.id, id));
    return r;
  }
  async createJournalEntry(insert: InsertJournalEntry) {
    const [r] = await this.db.insert(journalEntries).values(insert).returning();
    return r;
  }
  async updateJournalEntry(id: number, update: Partial<InsertJournalEntry>) {
    const [r] = await this.db.update(journalEntries).set(update)
      .where(eq(journalEntries.id, id)).returning();
    return r;
  }
  async deleteJournalEntry(id: number) {
    const r = await this.db.delete(journalEntries).where(eq(journalEntries.id, id));
    return (r.rowCount ?? 0) > 0;
  }

  // --- Celestial ---
  async getAllCelestialObjects() { return this.db.select().from(celestialObjects); }
  async getCelestialObjectsByType(type: string) {
    return this.db.select().from(celestialObjects)
      .where(eq(celestialObjects.type, type as any));
  }
  async getCelestialObject(id: number) {
    const [r] = await this.db.select().from(celestialObjects).where(eq(celestialObjects.id, id));
    return r;
  }
  async createCelestialObject(insert: InsertCelestialObject) {
    const [r] = await this.db.insert(celestialObjects).values(insert).returning();
    return r;
  }

  // --- Cosmic Patterns ---
  async getAllCosmicPatterns() { return this.db.select().from(cosmicPatterns); }
  async getCosmicPattern(id: number) {
    const [r] = await this.db.select().from(cosmicPatterns).where(eq(cosmicPatterns.id, id));
    return r;
  }
  async getRandomCosmicPattern() {
    const [r] = await this.db.select().from(cosmicPatterns).orderBy(sql`RANDOM()`).limit(1);
    return r;
  }
  async createCosmicPattern(insert: InsertCosmicPattern) {
    const [r] = await this.db.insert(cosmicPatterns).values(insert).returning();
    return r;
  }

  // --- Cosmic Sounds ---
  async getAllCosmicSounds() { return this.db.select().from(cosmicSounds); }
  async getCosmicSound(id: number) {
    const [r] = await this.db.select().from(cosmicSounds).where(eq(cosmicSounds.id, id));
    return r;
  }
  async createCosmicSound(insert: InsertCosmicSound) {
    const [r] = await this.db.insert(cosmicSounds).values(insert).returning();
    return r;
  }

  // --- Quiz Questions ---
  async getAllQuizQuestions() { return this.db.select().from(quizQuestions); }
  async getQuizQuestion(id: number) {
    const [r] = await this.db.select().from(quizQuestions).where(eq(quizQuestions.id, id));
    return r;
  }
  async createQuizQuestion(insert: InsertQuizQuestion) {
    const [r] = await this.db.insert(quizQuestions).values(insert).returning();
    return r;
  }

  // --- Quiz Results ---
  async getAllQuizResults() { return this.db.select().from(quizResults); }
  async getQuizResult(id: number) {
    const [r] = await this.db.select().from(quizResults).where(eq(quizResults.id, id));
    return r;
  }
  async createQuizResult(insert: InsertQuizResult) {
    const [r] = await this.db.insert(quizResults).values(insert).returning();
    return r;
  }

  // --- Traditions ---
  async getAllTraditions() { return this.db.select().from(traditions); }
  async getTradition(id: number) {
    const [r] = await this.db.select().from(traditions).where(eq(traditions.id, id));
    return r;
  }
  async getTraditionBySlug(slug: string) {
    const [r] = await this.db.select().from(traditions).where(eq(traditions.slug, slug));
    return r;
  }
  async getFeaturedTraditions() {
    return this.db.select().from(traditions).where(eq(traditions.featured, true));
  }
  async createTradition(insert: InsertTradition) {
    const [r] = await this.db.insert(traditions).values(insert).returning();
    return r;
  }
}
