export interface SlackConfig {
  botToken: string;
  signingSecret: string;
}

export interface SlackMessage {
  channel: string;
  text: string;
  ts: string;
  user?: string;
  threadTs?: string;
}

export interface SlackChannel {
  id: string;
  name: string;
  isPrivate: boolean;
  memberCount: number;
}
