import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Catches Prisma client errors and returns proper error responses.
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

    if (exception instanceof Prisma.PrismaClientInitializationError) {
      this.logger.error(`Database connection failed: ${exception.message}`);
      response.status(503).json({
        statusCode: 503,
        message: 'Database is unavailable. Please try again later.',
        error: 'Service Unavailable',
      });
      return;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle common Prisma errors
      switch (exception.code) {
        case 'P2002': {
          // Unique constraint violation
          const target =
            (exception.meta?.target as string[])?.join(', ') ?? 'field';
          response.status(409).json({
            statusCode: 409,
            message: `A record with this ${target} already exists.`,
            error: 'Conflict',
          });
          return;
        }
        case 'P2025':
          // Record not found
          response.status(404).json({
            statusCode: 404,
            message: 'Record not found.',
            error: 'Not Found',
          });
          return;
        default:
          this.logger.error(
            `Prisma error ${exception.code}: ${exception.message}`,
          );
          response.status(500).json({
            statusCode: 500,
            message: 'An internal database error occurred.',
            error: 'Internal Server Error',
          });
          return;
      }
    }

    // PrismaClientValidationError
    this.logger.error(`Prisma validation error: ${exception.message}`);
    response.status(400).json({
      statusCode: 400,
      message: 'Invalid database query.',
      error: 'Bad Request',
    });
  }
}
