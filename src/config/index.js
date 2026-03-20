import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

const sql = neon(import.meta.env.VITE_NEON_CONNECTION_STRING);
export const db = drizzle(sql, { schema, disableWarningInBrowsers: true });
