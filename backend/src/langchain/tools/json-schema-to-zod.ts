import { z } from 'zod';

export function jsonSchemaToZod(
  schema: Record<string, unknown>,
): z.ZodObject<any> {
  const properties = (schema.properties ?? {}) as Record<
    string,
    Record<string, unknown>
  >;
  const required = new Set((schema.required as string[]) ?? []);

  const shape: Record<string, z.ZodTypeAny> = {};

  for (const [key, prop] of Object.entries(properties)) {
    let field = buildField(prop);

    if (prop.description && typeof prop.description === 'string') {
      field = field.describe(prop.description);
    }

    if (!required.has(key)) {
      field = field.optional();
    }

    shape[key] = field;
  }

  return z.object(shape);
}

function buildField(prop: Record<string, unknown>): z.ZodTypeAny {
  if (prop.enum && Array.isArray(prop.enum) && prop.enum.length > 0) {
    return z.enum(prop.enum as [string, ...string[]]);
  }

  switch (prop.type) {
    case 'string':
      return z.string();

    case 'number':
    case 'integer':
      return z.number();

    case 'boolean':
      return z.boolean();

    case 'array': {
      const items = prop.items as Record<string, unknown> | undefined;
      if (items) {
        return z.array(buildField(items));
      }
      return z.array(z.any());
    }

    case 'object':
      return z.record(z.any());

    default:
      return z.any();
  }
}
