import {
  users, type User, type InsertUser,
  quotes, type Quote, type InsertQuote,
  journalEntries, type JournalEntry, type InsertJournalEntry,
  celestialObjects, type CelestialObject, type InsertCelestialObject,
  cosmicPatterns, type CosmicPattern, type InsertCosmicPattern,
  cosmicSounds, type CosmicSound, type InsertCosmicSound,
  quizQuestions, type QuizQuestion, type InsertQuizQuestion,
  quizResults, type QuizResult, type InsertQuizResult
} from "@shared/schema";

// Storage interface with CRUD methods for all entities
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quotes: Map<number, Quote>;
  private journalEntries: Map<number, JournalEntry>;
  private celestialObjects: Map<number, CelestialObject>;
  private cosmicPatterns: Map<number, CosmicPattern>;
  private cosmicSounds: Map<number, CosmicSound>;
  private quizQuestions: Map<number, QuizQuestion>;
  private quizResults: Map<number, QuizResult>;
  
  private currentUserIds: { [key: string]: number } = {
    users: 1,
    quotes: 1,
    journalEntries: 1,
    celestialObjects: 1,
    cosmicPatterns: 1,
    cosmicSounds: 1,
    quizQuestions: 1,
    quizResults: 1
  };

  constructor() {
    this.users = new Map();
    this.quotes = new Map();
    this.journalEntries = new Map();
    this.celestialObjects = new Map();
    this.cosmicPatterns = new Map();
    this.cosmicSounds = new Map();
    this.quizQuestions = new Map();
    this.quizResults = new Map();
    
    // Initialize with some sample data
    this.initializeData();
  }

  private initializeData() {
    // This would be filled with initial data for testing purposes
    // For production, real data would be loaded or entered by admins
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserIds.users++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Quote methods
  async getAllQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values());
  }
  
  async getQuote(id: number): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }
  
  async getRandomQuote(): Promise<Quote | undefined> {
    const quotes = Array.from(this.quotes.values());
    if (quotes.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }
  
  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = this.currentUserIds.quotes++;
    const createdAt = new Date();
    const quote: Quote = { ...insertQuote, id, createdAt };
    this.quotes.set(id, quote);
    return quote;
  }
  
  // Journal entry methods
  async getJournalEntriesByUserId(userId: number): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by newest first
  }
  
  async getJournalEntry(id: number): Promise<JournalEntry | undefined> {
    return this.journalEntries.get(id);
  }
  
  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const id = this.currentUserIds.journalEntries++;
    const createdAt = new Date();
    const entry: JournalEntry = { ...insertEntry, id, createdAt };
    this.journalEntries.set(id, entry);
    return entry;
  }
  
  async updateJournalEntry(id: number, updateData: Partial<InsertJournalEntry>): Promise<JournalEntry | undefined> {
    const entry = this.journalEntries.get(id);
    if (!entry) return undefined;
    
    const updatedEntry: JournalEntry = { ...entry, ...updateData };
    this.journalEntries.set(id, updatedEntry);
    return updatedEntry;
  }
  
  async deleteJournalEntry(id: number): Promise<boolean> {
    return this.journalEntries.delete(id);
  }
  
  // Celestial object methods
  async getAllCelestialObjects(): Promise<CelestialObject[]> {
    return Array.from(this.celestialObjects.values());
  }
  
  async getCelestialObjectsByType(type: string): Promise<CelestialObject[]> {
    return Array.from(this.celestialObjects.values())
      .filter(obj => obj.type.toLowerCase() === type.toLowerCase());
  }
  
  async getCelestialObject(id: number): Promise<CelestialObject | undefined> {
    return this.celestialObjects.get(id);
  }
  
  async createCelestialObject(insertObject: InsertCelestialObject): Promise<CelestialObject> {
    const id = this.currentUserIds.celestialObjects++;
    const createdAt = new Date();
    const object: CelestialObject = { ...insertObject, id, createdAt };
    this.celestialObjects.set(id, object);
    return object;
  }
  
  // Cosmic pattern methods
  async getAllCosmicPatterns(): Promise<CosmicPattern[]> {
    return Array.from(this.cosmicPatterns.values());
  }
  
  async getCosmicPattern(id: number): Promise<CosmicPattern | undefined> {
    return this.cosmicPatterns.get(id);
  }
  
  async getRandomCosmicPattern(): Promise<CosmicPattern | undefined> {
    const patterns = Array.from(this.cosmicPatterns.values());
    if (patterns.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * patterns.length);
    return patterns[randomIndex];
  }
  
  async createCosmicPattern(insertPattern: InsertCosmicPattern): Promise<CosmicPattern> {
    const id = this.currentUserIds.cosmicPatterns++;
    const createdAt = new Date();
    const pattern: CosmicPattern = { ...insertPattern, id, createdAt };
    this.cosmicPatterns.set(id, pattern);
    return pattern;
  }
  
  // Cosmic sound methods
  async getAllCosmicSounds(): Promise<CosmicSound[]> {
    return Array.from(this.cosmicSounds.values());
  }
  
  async getCosmicSound(id: number): Promise<CosmicSound | undefined> {
    return this.cosmicSounds.get(id);
  }
  
  async createCosmicSound(insertSound: InsertCosmicSound): Promise<CosmicSound> {
    const id = this.currentUserIds.cosmicSounds++;
    const createdAt = new Date();
    const sound: CosmicSound = { ...insertSound, id, createdAt };
    this.cosmicSounds.set(id, sound);
    return sound;
  }
  
  // Quiz question methods
  async getAllQuizQuestions(): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values());
  }
  
  async getQuizQuestion(id: number): Promise<QuizQuestion | undefined> {
    return this.quizQuestions.get(id);
  }
  
  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.currentUserIds.quizQuestions++;
    const createdAt = new Date();
    const question: QuizQuestion = { ...insertQuestion, id, createdAt };
    this.quizQuestions.set(id, question);
    return question;
  }
  
  // Quiz result methods
  async getAllQuizResults(): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values());
  }
  
  async getQuizResult(id: number): Promise<QuizResult | undefined> {
    return this.quizResults.get(id);
  }
  
  async createQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const id = this.currentUserIds.quizResults++;
    const createdAt = new Date();
    const result: QuizResult = { ...insertResult, id, createdAt };
    this.quizResults.set(id, result);
    return result;
  }
}

export const storage = new MemStorage();
