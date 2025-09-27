import { z } from 'zod'

export const ScorePostSchema = z.object({
  points: z.number().int().min(0).max(100000),
  category: z.string().optional(),
  difficulty: z.enum(['easy','medium','hard']).optional(),
})

export const NameSchema = z.object({
  displayName: z.string().min(1).max(24)
})