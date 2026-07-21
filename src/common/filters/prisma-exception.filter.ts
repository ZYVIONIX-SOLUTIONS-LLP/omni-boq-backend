import { ArgumentsHost, Catch, ConflictException, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code === 'P2002') {
      const target = (exception.meta?.target as string[] | undefined)?.join(', ') ?? 'field';
      const conflict = new ConflictException(`A record with this ${target} already exists`);
      response.status(conflict.getStatus()).json(conflict.getResponse());
      return;
    }

    if (exception.code === 'P2003') {
      const conflict = new ConflictException(
        'This record is referenced by other data and cannot be modified this way',
      );
      response.status(conflict.getStatus()).json(conflict.getResponse());
      return;
    }

    if (exception.code === 'P2025') {
      response.status(404).json({ statusCode: 404, message: 'Record not found' });
      return;
    }

    response.status(500).json({ statusCode: 500, message: 'Database error' });
  }
}
