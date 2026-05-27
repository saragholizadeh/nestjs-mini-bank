import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../infrastructure/database/entities/user.entity';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);
