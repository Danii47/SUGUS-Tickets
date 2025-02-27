import { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"
import fs from "fs"
import { defaultButtonsConfig } from "./defaultEmbedsAndButtonsConfig"
import { ButtonsType } from "../types/CustomTypes"
import { truncateString } from "../utils/truncateString"

const Buttons: ButtonsType = {
  close: new ActionRowBuilder<ButtonBuilder>()
    .addComponents([
      new ButtonBuilder()
        .setCustomId(defaultButtonsConfig.close.customId)
        .setLabel(defaultButtonsConfig.close.label)
        .setStyle(defaultButtonsConfig.close.style)
        .setEmoji(defaultButtonsConfig.close.emoji)
        .setDisabled(defaultButtonsConfig.close.disabled)
    ]),
  cancelAndConfirmClose: new ActionRowBuilder<ButtonBuilder>()
    .addComponents([
      new ButtonBuilder()
        .setCustomId(defaultButtonsConfig.cancelClose.customId)
        .setLabel(defaultButtonsConfig.cancelClose.label)
        .setStyle(defaultButtonsConfig.cancelClose.style)
        .setEmoji(defaultButtonsConfig.cancelClose.emoji)
        .setDisabled(defaultButtonsConfig.cancelClose.disabled),


      new ButtonBuilder()
        .setCustomId(defaultButtonsConfig.confirmClose.customId)
        .setLabel(defaultButtonsConfig.confirmClose.label)
        .setStyle(defaultButtonsConfig.confirmClose.style)
        .setEmoji(defaultButtonsConfig.confirmClose.emoji)
        .setDisabled(defaultButtonsConfig.confirmClose.disabled)
    ]),
  deleteAndReopen: new ActionRowBuilder<ButtonBuilder>()
    .addComponents([
      new ButtonBuilder()
        .setCustomId(defaultButtonsConfig.delete.customId)
        .setLabel(defaultButtonsConfig.delete.label)
        .setStyle(defaultButtonsConfig.delete.style)
        .setEmoji(defaultButtonsConfig.delete.emoji)
        .setDisabled(defaultButtonsConfig.delete.disabled),

      new ButtonBuilder()
        .setCustomId(defaultButtonsConfig.reopen.customId)
        .setLabel(defaultButtonsConfig.reopen.label)
        .setStyle(defaultButtonsConfig.reopen.style)
        .setEmoji(defaultButtonsConfig.reopen.emoji)
        .setDisabled(defaultButtonsConfig.reopen.disabled)
    ]),
  create: {}
}

const guildTicketsFiles = fs.readdirSync(`./${process.env.DEVELOPMENT === "true" ? "src" : "dist"}/guildTickets`)
for (const guildTicketsFile of guildTicketsFiles) {
  const { Config: guildTicketsConfig } = require(`../guildTickets/${guildTicketsFile}`)

  for (const guildTicketsConfigProperty in guildTicketsConfig) {
    Buttons.create[guildTicketsConfigProperty] = new ActionRowBuilder()

    const select = new StringSelectMenuBuilder()
      .setCustomId(`select-${guildTicketsFile}`)
      .setPlaceholder("Haz una selección")

    for (const property in guildTicketsConfig[guildTicketsConfigProperty].ticketOptions) {

      const ticketInfo = guildTicketsConfig[guildTicketsConfigProperty].ticketOptions[property]

      select.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(ticketInfo.label)
          .setDescription(truncateString(ticketInfo.description.replaceAll("*", "").replaceAll("__", ""), 95))
          .setValue(ticketInfo.customId)
      )
    }

    Buttons.create[guildTicketsConfigProperty].addComponents(select)
  }
}

export { Buttons }
