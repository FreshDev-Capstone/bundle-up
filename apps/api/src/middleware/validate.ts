import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodSchema } from 'zod';

type Target = 'body' | 'query' | 'params';

/**
 * Validates `req[target]` against the provided Zod schema.
 * On failure returns 400 with field-level error messages.
 * On success, replaces `req[target]` with the parsed (coerced) value.
 */
export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const errors = result.error instanceof ZodError
        ? result.error.flatten().fieldErrors
        : {};
      res.status(400).json({ success: false, message: 'Validation error', errors });
      return;
    }
    // Replace with parsed (coerced/defaulted) values
    (req as unknown as Record<string, unknown>)[target] = result.data;
    next();
  };
}
