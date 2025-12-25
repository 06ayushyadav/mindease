import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

function formatZod(err: ZodError) {
  return err.issues.map((i) => ({
    path: i.path.join("."),
    msg: i.message,
    code: i.code,
  }));
}

export function validate(schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res
          .status(400)
          .json({ ok: false, error: "VALIDATION_ERROR", issues: formatZod(e) });
      }
      next(e);
    }
  };
}
