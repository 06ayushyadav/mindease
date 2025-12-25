import mongoose from "mongoose";
import { z } from "zod";

interface FieldMeta {
  unique?: boolean;
  index?: boolean;
  default?: any;
}

export function zodToMongoose<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  fieldMeta: Record<string, FieldMeta> = {},
  returnType: "schema" | "definition" = "schema" // <-- new optional param
) {
  const mongooseSchemaDef: mongoose.SchemaDefinition = {};

  for (const [key, value] of Object.entries(schema.shape)) {
    let fieldDef: any = {};
    const meta = fieldMeta[key] || {};

    if (value instanceof z.ZodString) {
      fieldDef.type = String;
      const checks = (value._def.checks || []) as any[];
      for (const check of checks) {
        if (check.kind === "min") fieldDef.minlength = check.value;
        if (check.kind === "max") fieldDef.maxlength = check.value;
      }
      fieldDef.required = !(value.isOptional?.() ?? false);
    } else if (value instanceof z.ZodNumber) {
      fieldDef.type = Number;
      const checks = (value._def.checks || []) as any[];
      for (const check of checks) {
        if (check.kind === "min") fieldDef.min = check.value;
        if (check.kind === "max") fieldDef.max = check.value;
      }
      fieldDef.required = !(value.isOptional?.() ?? false);
    } else if (value instanceof z.ZodBoolean) {
      fieldDef.type = Boolean;
      fieldDef.required = !(value.isOptional?.() ?? false);
    } else if (value instanceof z.ZodDate) {
      fieldDef.type = Date;
      fieldDef.required = !(value.isOptional?.() ?? false);
    } else {
      fieldDef.type = String;
      fieldDef.required = !(value.isOptional?.() ?? false);
    }

    if (meta.unique) fieldDef.unique = true;
    if (meta.index) fieldDef.index = true;
    if (meta.default !== undefined) fieldDef.default = meta.default;

    mongooseSchemaDef[key] = fieldDef;
  }

  if (returnType === "definition") return mongooseSchemaDef;

  return new mongoose.Schema(mongooseSchemaDef, {
    timestamps: true,
    strict: "throw",
    versionKey: false,
  });
}
