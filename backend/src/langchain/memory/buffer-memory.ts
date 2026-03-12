import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

export interface MemoryMessage {
  role: string;
  content: string;
  timestamp: Date;
}

/** Default TTL: 30 days */
const DEFAULT_TTL_DAYS = 30;

@Injectable()
export class BufferMemory {
  private readonly logger = new Logger(BufferMemory.name);

  constructor(private readonly prisma: PrismaService) {}

  async addMessage(
    sessionId: string,
    message: Omit<MemoryMessage, 'timestamp'>,
  ): Promise<void> {
    await this.prisma.conversationMessage.create({
      data: {
        sessionId,
        role: message.role,
        content: message.content,
      },
    });
  }

  // Fix #24: When limit is set, return the MOST RECENT N messages (not oldest)
  async getMessages(
    sessionId: string,
    limit?: number,
  ): Promise<MemoryMessage[]> {
    if (limit) {
      // Fetch last N messages by ordering desc, then reverse for chronological order
      const messages = await this.prisma.conversationMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return messages
        .reverse()
        .map((m: { role: string; content: string; createdAt: Date }) => ({
          role: m.role,
          content: m.content,
          timestamp: m.createdAt,
        }));
    }

    const messages = await this.prisma.conversationMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map(
      (m: { role: string; content: string; createdAt: Date }) => ({
        role: m.role,
        content: m.content,
        timestamp: m.createdAt,
      }),
    );
  }

  async clearSession(sessionId: string): Promise<void> {
    await this.prisma.conversationMessage.deleteMany({
      where: { sessionId },
    });
  }

  async getSessionIds(): Promise<string[]> {
    const sessions = await this.prisma.conversationMessage.findMany({
      select: { sessionId: true },
      distinct: ['sessionId'],
    });
    return sessions.map((s: { sessionId: string }) => s.sessionId);
  }

  // Fix #14: Scheduled cleanup of old conversation messages
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupExpiredMessages(): Promise<void> {
    const ttlDays = parseInt(
      process.env.CONVERSATION_TTL_DAYS ?? `${DEFAULT_TTL_DAYS}`,
      10,
    );
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - ttlDays);

    try {
      const result = await this.prisma.conversationMessage.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
        },
      });
      if (result.count > 0) {
        this.logger.log(
          `Cleaned up ${result.count} conversation messages older than ${ttlDays} days`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to cleanup expired messages: ${(error as Error).message}`,
      );
    }
  }
}
