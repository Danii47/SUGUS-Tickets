import fs from "node:fs"

export const getTicketCustomIds = (): string[] => {

  const createTicketsCustomIds: string[] = []

  const guildTicketsFiles = fs.readdirSync("./src/guildTickets")

  for (const guildTicketsFile of guildTicketsFiles) {
    const { Config: guildTicketsConfig } = require(`../guildTickets/${guildTicketsFile}`)

    for (const guildTicketsConfigProperty in guildTicketsConfig) {
      for (const tickets in guildTicketsConfig[guildTicketsConfigProperty].ticketOptions) {

        createTicketsCustomIds.push(guildTicketsConfig[guildTicketsConfigProperty].ticketOptions[tickets].customId)

      }
    }
  }

  return createTicketsCustomIds
}
