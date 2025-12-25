import { z } from "zod";

export const contextSchema = z.object({
  sleepHours: z.number().min(0).max(24),
  exerciseMinutes: z.number().min(0).max(1000),
});

export const userMoodCreateSchema = z.object({
  rating: z.number().int().min(1).max(10),
  tags: z.array(z.string().min(1)),
  note: z.string().max(2000),
  context: contextSchema,
  createdAt: z
    .preprocess(
      (v) => (v ? new Date(v as string | number) : new Date()),
      z.instanceof(Date)
    )
    .optional(),
});

export type UserMoodCreate = z.infer<typeof userMoodCreateSchema>;

export const userMoodEntrySchema = userMoodCreateSchema.extend({
  _id: z.string(),
  userId: z.string().optional(),
});

export type UserMoodEntry = z.infer<typeof userMoodEntrySchema>;
