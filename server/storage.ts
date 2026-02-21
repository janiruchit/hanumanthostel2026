
import { users, rentRecords, menuItems, notifications, adminSettings, type User, type InsertUser, type RentRecord, type InsertRent, type MenuItem, type InsertMenu, type Notification, type InsertNotification, type AdminSettings, type InsertSettings } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  getAllStudents(): Promise<User[]>;

  createRentRecord(rent: InsertRent): Promise<RentRecord>;
  getRentRecords(): Promise<RentRecord[]>;
  getRentRecordsByStudent(studentId: number): Promise<RentRecord[]>;
  markRentPaid(id: number): Promise<RentRecord>;

  getMenuItems(): Promise<MenuItem[]>;
  updateMenuItem(item: InsertMenu): Promise<MenuItem>;
  
  createNotification(note: InsertNotification): Promise<Notification>;
  getNotifications(): Promise<Notification[]>;

  getAdminSettings(): Promise<AdminSettings | undefined>;
  updateAdminSettings(settings: InsertSettings): Promise<AdminSettings>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor(sessionStore: session.Store) {
    this.sessionStore = sessionStore;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User> {
    const [updated] = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return updated;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getAllStudents(): Promise<User[]> {
    return db.select().from(users).where(eq(users.role, "student"));
  }

  async createRentRecord(rent: InsertRent): Promise<RentRecord> {
    const [record] = await db.insert(rentRecords).values(rent).returning();
    return record;
  }

  async getRentRecords(): Promise<RentRecord[]> {
    return db.select().from(rentRecords).orderBy(desc(rentRecords.id));
  }

  async getRentRecordsByStudent(studentId: number): Promise<RentRecord[]> {
    return db.select().from(rentRecords).where(eq(rentRecords.studentId, studentId)).orderBy(desc(rentRecords.id));
  }

  async markRentPaid(id: number): Promise<RentRecord> {
    const [updated] = await db.update(rentRecords)
      .set({ status: "paid", paymentDate: new Date() })
      .where(eq(rentRecords.id, id))
      .returning();
    return updated;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return db.select().from(menuItems);
  }

  async updateMenuItem(item: InsertMenu): Promise<MenuItem> {
    // Check if day exists
    const [existing] = await db.select().from(menuItems).where(eq(menuItems.day, item.day));
    if (existing) {
      const [updated] = await db.update(menuItems).set(item).where(eq(menuItems.id, existing.id)).returning();
      return updated;
    } else {
      const [newItem] = await db.insert(menuItems).values(item).returning();
      return newItem;
    }
  }

  async createNotification(note: InsertNotification): Promise<Notification> {
    const [newNote] = await db.insert(notifications).values(note).returning();
    return newNote;
  }

  async getNotifications(): Promise<Notification[]> {
    return db.select().from(notifications).orderBy(desc(notifications.createdAt));
  }

  async getAdminSettings(): Promise<AdminSettings | undefined> {
    const [settings] = await db.select().from(adminSettings).limit(1);
    return settings;
  }

  async updateAdminSettings(settings: InsertSettings): Promise<AdminSettings> {
    const existing = await this.getAdminSettings();
    if (existing) {
      const [updated] = await db.update(adminSettings).set(settings).where(eq(adminSettings.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(adminSettings).values(settings).returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage(new MemoryStore({
  checkPeriod: 86400000
}));
