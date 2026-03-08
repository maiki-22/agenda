import { z } from "zod";

export const ServiceIdSchema = z.string().min(1).max(100).trim();