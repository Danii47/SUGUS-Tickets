const fs = require("fs")

const getTicketByCustomId = (customId) => {

  let ticketInfo

  const guildTicketsFiles = fs.readdirSync("./guildTickets")
  for (const guildTicketsFile of guildTicketsFiles) {
    const guildTicketsConfig = require(`../guildTickets/${guildTicketsFile}`)
    for (const guildTicketsConfigProperty in guildTicketsConfig) {
      for (const tickets in guildTicketsConfig[guildTicketsConfigProperty].ticketOptions) {
        const ticketCustomId = guildTicketsConfig[guildTicketsConfigProperty].ticketOptions[tickets].customId
        if (customId === ticketCustomId) ticketInfo = guildTicketsConfig[guildTicketsConfigProperty].ticketOptions[tickets]
      }
    }
  }
  return ticketInfo
}

module.exports = getTicketByCustomId
