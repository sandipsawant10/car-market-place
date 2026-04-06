import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/config/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.VITE_NEON_CONNECTION_STRING,
  },
});
