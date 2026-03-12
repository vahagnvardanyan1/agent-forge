import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/execution', cors: { origin: '*' } })
export class ExecutionGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ExecutionGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @MessageBody() data: { executionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(`execution:${data.executionId}`);
    this.logger.log(
      `Client ${client.id} subscribed to execution ${data.executionId}`,
    );
    return { event: 'subscribed', data: { executionId: data.executionId } };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(
    @MessageBody() data: { executionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    void client.leave(`execution:${data.executionId}`);
    return { event: 'unsubscribed', data: { executionId: data.executionId } };
  }

  emitExecutionUpdate(
    executionId: string,
    update: {
      status: string;
      output?: Record<string, unknown>;
      error?: string;
    },
  ) {
    this.server
      .to(`execution:${executionId}`)
      .emit('execution:update', { executionId, ...update });
  }

  emitStreamChunk(executionId: string, chunk: string) {
    this.server
      .to(`execution:${executionId}`)
      .emit('execution:stream', { executionId, chunk });
  }
}
