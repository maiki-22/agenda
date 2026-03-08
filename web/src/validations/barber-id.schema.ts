import { z } from "zod";

export const BarberIdSchema = z.string().min(1).max(100).trim();