import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, Collection, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js"

export interface MyClient extends Client {
  slashCommands: Collection<string, any>
  commands: any[]
}

export interface RolePermission {
  id: string;
  allow?: string[];
  deny?: string[];
}

export interface TicketInfo {
  name: string;
  description: string;
  customId: string;
  label: string;
  style: string;
  emoji: string;
  disabled: boolean;
  categoryId: string;
  embedTitle: () => string;
  embedDescription: string;
  embedColor: string;
  mentions: string[];
  channelTranscriptsId: string;
  permissions: RolePermission[];
}

export interface TicketConfig {
  openTicketChannelId: string;
  openTicketEmbedTitle: string;
  openTicketEmbedDescription: () => string;
  openTicketEmbedColor: string;
  ticketOptions: {
    [key: string]: TicketInfo;
  };
}

export interface ConfigType {
  [key: string]: TicketConfig;
}

interface ButtonConfig {
  customId: string;
  label: string;
  style: ButtonStyle;
  emoji: string;
  disabled: boolean;
}

export interface ButtonsConfig {
  [key: string]: ButtonConfig
}

interface CreateButtonType {
  [key: string]: ActionRowBuilder<StringSelectMenuBuilder>;
}

export interface ButtonsType {
  close: ActionRowBuilder<ButtonBuilder>;
  cancelAndConfirmClose: ActionRowBuilder<ButtonBuilder>;
  deleteAndReopen: ActionRowBuilder<ButtonBuilder>;
  create: CreateButtonType;
}

export type ButtonHandlerFunction = (a: MyClient, b: ButtonInteraction | StringSelectMenuInteraction) => void