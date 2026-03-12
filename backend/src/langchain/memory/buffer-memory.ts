import { Injectable } from '@nestjs/common';

export interface MemoryMessage {
  role: string;
  content: string;
  timestamp: Date;
}

@Injectable()
export class BufferMemory {
  private sessions: Map<string, MemoryMessage[]> = new Map();

  addMessage(
    sessionId: string,
    message: Omit<MemoryMessage, 'timestamp'>,
  ): void {
    const messages = this.sessions.get(sessionId) ?? [];
    messages.push({ ...message, timestamp: new Date() });
    this.sessions.set(sessionId, messages);
  }

  getMessages(sessionId: string, limit?: number): MemoryMessage[] {
    const messages = this.sessions.get(sessionId) ?? [];
    return limit ? messages.slice(-limit) : messages;
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  getSessionIds(): string[] {
    return Array.from(this.sessions.keys());
  }
}
