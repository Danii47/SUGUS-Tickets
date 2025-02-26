import fs from "node:fs"

export const getTicketCustomIds = (): string[] => {

  const createTicketsCustomIds: string[] = []

  const guildTicketsFiles = fs.readdirSync("./guildTickets")

  for (const guildTicketsFile of guildTicketsFiles) {
    const guildTicketsConfig = require(`../guildTickets/${guildTicketsFile}`)

    for (const guildTicketsConfigProperty in guildTicketsConfig) {
      for (const tickets in guildTicketsConfig[guildTicketsConfigProperty].ticketOptions) {

        createTicketsCustomIds.push(guildTicketsConfig[guildTicketsConfigProperty].ticketOptions[tickets].customId)

      }
    }
  }

  return createTicketsCustomIds
}
