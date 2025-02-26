import { ConfigType } from "../types/CustomTypes"

const { ctfRoles: roles } = require("../../configs/rolesId.json")

const Config: ConfigType = {
  ctfTickets: {
    openTicketChannelId: "1343955312557948969",
    openTicketEmbedTitle: "TICKETS CTF",
    openTicketEmbedDescription: function () {
      let description = ""
      for (const property in this.ticketOptions) {
        description += `\n**${this.ticketOptions[property].label.toUpperCase()}**\n${this.ticketOptions[property].description}\n`
      }
      return description
    },
    openTicketEmbedColor: "8a5b8f",
    ticketOptions: {

      "dude": {
        name: "duda",
        description: "Apartado para consultar cualquier tipo de duda sobre el CTF o algún reto.",
        customId: "dude",
        label: "Duda",
        style: "Secondary",
        emoji: "❓",
        disabled: false,
        categoryId: "1343913385317892177",
        embedTitle: function () {
          return `
          TICKET ${this.label.toUpperCase()}
          `
        },
        embedDescription: `Plantilla...`,
        embedColor: "8a5b8f",
        mentions: [roles.admin, roles.staff],
        channelTranscriptsId: "1344236061668409395",
        permissions: [
          { id: roles.everyone, deny: ['ViewChannel'] },
          { id: roles.admin, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
          { id: roles.staff, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
        ]
      },
      "bug": {
        name: "bug",
        description: "Apartado para avisar sobre algún bug o error en el CTF.",
        customId: "bug",
        label: "Bug",
        style: "Secondary",
        emoji: "🔨",
        disabled: false,
        categoryId: "1343913385317892177",
        embedTitle: function () {
          return `
          TICKET ${this.label.toUpperCase()}
          `
        },
        embedDescription: `Plantilla...`,
        embedColor: "8a5b8f",
        mentions: [roles.admin, roles.staff],
        channelTranscriptsId: "1344236061668409395",
        permissions: [
          { id: roles.everyone, deny: ['ViewChannel'] },
          { id: roles.admin, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
          { id: roles.staff, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
        ]
      },
    }
  }
}

module.exports = Config
