
import { z } from 'zod';
import { insertUserSchema, insertRentSchema, insertMenuSchema, insertNotificationSchema, insertSettingsSchema } from './schema';

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({ id: z.number(), username: z.string(), role: z.string() }),
        401: z.object({ message: z.string() })
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: { 200: z.void() }
    },
    register: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: insertUserSchema,
      responses: { 201: z.object({ id: z.number() }), 400: z.object({ message: z.string() }) }
    },
    me: {
      method: 'GET' as const,
      path: '/api/user' as const,
      responses: { 200: z.object({ id: z.number(), username: z.string(), role: z.string() }) }
    }
  },
  students: {
    list: {
      method: 'GET' as const,
      path: '/api/students' as const,
      responses: { 200: z.array(z.any()) } // Using any for simplicity in list to avoid circular deps if linking rent
    },
    create: {
      method: 'POST' as const,
      path: '/api/students' as const,
      input: insertUserSchema,
      responses: { 201: z.any() }
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/students/:id' as const,
      input: insertUserSchema.partial(),
      responses: { 200: z.any() }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/students/:id' as const,
      responses: { 200: z.void() }
    }
  },
  rent: {
    list: {
      method: 'GET' as const,
      path: '/api/rent' as const,
      responses: { 200: z.array(z.any()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/rent' as const,
      input: insertRentSchema,
      responses: { 201: z.any() }
    },
    markPaid: {
      method: 'PATCH' as const,
      path: '/api/rent/:id/pay' as const,
      responses: { 200: z.any() }
    }
  },
  menu: {
    list: {
      method: 'GET' as const,
      path: '/api/menu' as const,
      responses: { 200: z.array(z.any()) }
    },
    update: {
      method: 'POST' as const, // Bulk update or single? Let's do single per day or bulk. simpler to just PUT /api/menu/:id
      path: '/api/menu' as const,
      input: insertMenuSchema, // We'll handle upsert logic
      responses: { 200: z.any() }
    }
  },
  notifications: {
    list: {
      method: 'GET' as const,
      path: '/api/notifications' as const,
      responses: { 200: z.array(z.any()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/notifications' as const,
      input: insertNotificationSchema,
      responses: { 201: z.any() }
    }
  },
  settings: {
    get: {
      method: 'GET' as const,
      path: '/api/settings' as const,
      responses: { 200: z.any() }
    },
    update: {
      method: 'POST' as const,
      path: '/api/settings' as const,
      input: insertSettingsSchema,
      responses: { 200: z.any() }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
