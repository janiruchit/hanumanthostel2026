
import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"), // 'admin' | 'student'
  name: text("name").notNull(),
  roomNumber: text("room_number"),
  sharingType: text("sharing_type"), // '3-sharing' | '6-sharing'
  aadharNumber: text("aadhar_number"),
  mobile: text("mobile"),
});

export const rentRecords = pgTable("rent_records", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("unpaid"), // 'paid' | 'unpaid'
  month: text("month").notNull(), // e.g., "October 2023"
  paymentDate: timestamp("payment_date"),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  day: text("day").notNull(), // 'Monday', 'Tuesday', ...
  breakfast: text("breakfast"),
  lunch: text("lunch"),
  dinner: text("dinner"),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminSettings = pgTable("admin_settings", {
  id: serial("id").primaryKey(),
  upiId: text("upi_id"),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertRentSchema = createInsertSchema(rentRecords).omit({ id: true, paymentDate: true });
export const insertMenuSchema = createInsertSchema(menuItems).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertSettingsSchema = createInsertSchema(adminSettings).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type RentRecord = typeof rentRecords.$inferSelect;
export type InsertRent = z.infer<typeof insertRentSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenu = z.infer<typeof insertMenuSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type AdminSettings = typeof adminSettings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
