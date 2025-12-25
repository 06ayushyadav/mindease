import { z } from "zod";

export const IdStr = z.string().min(1, "id required");
export const UserId = z.string().min(1).max(128);

export const PagenationQuerry = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});
