import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Prisma's Decimal fields (all money/quantity columns) serialize to JSON as
 *  strings by default (Decimal.prototype.toJSON returns a string) — this
 *  recursively converts every Decimal instance in a response to a plain
 *  number before it reaches the frontend, which expects real numbers. */
function transform(value: unknown): unknown {
  if (value instanceof Prisma.Decimal) return value.toNumber();
  if (Array.isArray(value)) return value.map(transform);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) out[key] = transform(v);
    return out;
  }
  return value;
}

@Injectable()
export class TransformDecimalsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => transform(data)));
  }
}
