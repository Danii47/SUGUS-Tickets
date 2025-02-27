import { TicketInfo } from "../types/CustomTypes"
import fs from "fs"

export const getTicketByCustomId = (customId: string): TicketInfo => {

  let ticketInfo

  const guildTicketsFiles = fs.readdirSync("./dist/guildTickets")

  for (const guildTicketsFile of guildTicketsFiles) {
    const { Config: guildTicketsConfig } = require(`../guildTickets/${guildTicketsFile}`)

    for (const guildTicketsConfigProperty in guildTicketsConfig) {
      for (const tickets in guildTicketsConfig[guildTicketsConfigProperty].ticketOptions) {

        const ticketCustomId = guildTicketsConfig[guildTicketsConfigProperty].ticketOptions[tickets].customId
        if (customId === ticketCustomId) ticketInfo = guildTicketsConfig[guildTicketsConfigProperty].ticketOptions[tickets]

      }
    }
  }

  return ticketInfo
}
