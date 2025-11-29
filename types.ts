export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ResourceLink {
  label: string;
  url: string;
  category: 'music' | 'game' | 'resource';
  icon?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
