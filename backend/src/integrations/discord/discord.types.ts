export interface DiscordConfig {
  botToken: string;
  applicationId: string;
}

export interface DiscordMessage {
  id: string;
  channelId: string;
  content: string;
  author: {
    id: string;
    username: string;
    discriminator: string;
  };
  timestamp: string;
}

export interface DiscordGuild {
  id: string;
  name: string;
  memberCount: number;
  icon: string;
}
