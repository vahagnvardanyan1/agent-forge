import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Catches Prisma client errors (e.g. DB not running) and returns
 * graceful empty responses instead of 500s in development.
 */
@Catch(
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientValidationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    this.logger.warn(
      `Database unavailable — returning empty response. Error: ${exception.message}`,
    );

    response.status(200).json({
      agents: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
      data: [],
      _dbUnavailable: true,
    });
  }
}
