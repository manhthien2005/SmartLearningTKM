import { z } from 'zod';

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  FRONTEND_URL: z.string().url().optional().default('http://localhost:3000'),
  
  // Database
  DATABASE_URL: z.string().min(1),
  DATABASE_POOL_MIN: z.coerce.number().optional().default(2),
  DATABASE_POOL_MAX: z.coerce.number().optional().default(10),
  DATABASE_POOL_TIMEOUT: z.coerce.number().optional().default(20000),
  
  // Auth
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().optional().default('7d'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().optional().default('30d'),
  
  // Email
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string().min(1),
  EMAIL_FROM: z.string().email().optional(),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).optional().default('info'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().optional().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().optional().default(100),
  
  // Error Monitoring (Optional)
  SENTRY_DSN: z.string().url().optional(),
  
  // API Keys (Optional)
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  
  // File Upload (Optional)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
