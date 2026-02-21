
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { api } from "@shared/routes";
import { insertRentSchema, insertMenuSchema, insertNotificationSchema, insertSettingsSchema } from "@shared/schema";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  setupAuth(app);

  // Seed Data
  const existingUsers = await storage.getAllStudents();
  const admin = await storage.getUserByUsername("admin");
  if (!admin && existingUsers.length === 0) {
    const adminPass = await hashPassword("admin123");
    await storage.createUser({
      username: "admin",
      password: adminPass,
      role: "admin",
      name: "Hanumant Admin",
      mobile: "9999999999",
      roomNumber: "Office"
    });

    const studentPass = await hashPassword("student123");
    const s1 = await storage.createUser({
      username: "rahul",
      password: studentPass,
      role: "student",
      name: "Rahul Kumar",
      mobile: "9876543210",
      roomNumber: "101",
      sharingType: "6-sharing"
    });

    await storage.createUser({
      username: "amit",
      password: studentPass,
      role: "student",
      name: "Amit Sharma",
      mobile: "9876543211",
      roomNumber: "102",
      sharingType: "3-sharing"
    });

    // Seed Menu
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (const day of days) {
      await storage.updateMenuItem({
        day,
        breakfast: "Poha, Tea",
        lunch: "Dal, Rice, Roti, Sabzi",
        dinner: "Khichdi, Kadhi"
      });
    }

    // Seed Rent
    await storage.createRentRecord({
      studentId: s1.id,
      amount: 8500,
      status: "unpaid",
      month: "October 2023"
    });

    // Seed Notification
    await storage.createNotification({
      message: "Welcome to Hanumant Hostel! Please pay your rent by 5th."
    });
    
    // Seed Settings
    await storage.updateAdminSettings({
      upiId: "hanumant@upi"
    });
    
    console.log("Database seeded!");
  }

  // === STUDENTS ===
  app.get(api.students.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const students = await storage.getAllStudents();
    res.json(students);
  });

  app.patch(api.students.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // Add logic to ensure only admin can update or user can update self
    const updated = await storage.updateUser(Number(req.params.id), req.body);
    res.json(updated);
  });

  app.delete(api.students.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteUser(Number(req.params.id));
    res.sendStatus(200);
  });

  // === RENT ===
  app.get(api.rent.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role === 'admin') {
      const records = await storage.getRentRecords();
      res.json(records);
    } else {
      const records = await storage.getRentRecordsByStudent(user.id);
      res.json(records);
    }
  });

  app.post(api.rent.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const record = await storage.createRentRecord(req.body);
    res.status(201).json(record);
  });

  app.patch(api.rent.markPaid.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const updated = await storage.markRentPaid(Number(req.params.id));
    res.json(updated);
  });

  // === MENU ===
  app.get(api.menu.list.path, async (req, res) => {
    const items = await storage.getMenuItems();
    res.json(items);
  });

  app.post(api.menu.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const updated = await storage.updateMenuItem(req.body);
    res.json(updated);
  });

  // === NOTIFICATIONS ===
  app.get(api.notifications.list.path, async (req, res) => {
    const notifs = await storage.getNotifications();
    res.json(notifs);
  });

  app.post(api.notifications.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const notif = await storage.createNotification(req.body);
    res.status(201).json(notif);
  });

  // === SETTINGS ===
  app.get(api.settings.get.path, async (req, res) => {
    const settings = await storage.getAdminSettings();
    res.json(settings || {});
  });

  app.post(api.settings.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const updated = await storage.updateAdminSettings(req.body);
    res.json(updated);
  });

  return httpServer;
}
