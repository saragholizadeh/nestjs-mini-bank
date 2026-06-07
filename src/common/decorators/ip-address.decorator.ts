import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const IpAddress = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest<Request>();

    // X-Forwarded-For is set by proxies/load balancers (e.g. Nginx, AWS ALB)
    // always prefer it over req.ip in production
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      const forwardedValue = Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded;

      // X-Forwarded-For can be a comma-separated list: "client, proxy1, proxy2"
      // the first one is the original client IP
      return forwardedValue.split(',')[0].trim();
    }

    return request.ip ?? null;
  },
);
