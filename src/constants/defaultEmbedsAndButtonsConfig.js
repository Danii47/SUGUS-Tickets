const defaultButtonsConfig = {
  close: {
    customId: "close",
    label: " ",
    style: "Secondary",
    emoji: "🔒",
    disabled: false
  },
  cancelClose: {
    customId: "cancelClose",
    label: "CANCELAR",
    style: "Secondary",
    emoji: "❌",
    disabled: false
  },
  confirmClose: {
    customId: "confirmClose",
    label: "CERRAR",
    style: "Danger",
    emoji: "✅",
    disabled: false
  },
  delete: {
    customId: "delete",
    label: " ",
    style: "Secondary",
    emoji: "🗑️",
    disabled: false
  },
  reopen: {
    customId: "reopen",
    label: " ",
    style: "Secondary",
    emoji: "🔓",
    disabled: false
  }
}

const defaultEmbedsConfig = {
  closeTicket: {
    title: null,
    description: "❓ ¿Estás seguro de que quieres cerrar el ticket?",
    color: "Red"
  },
  deleteTicket: {
    color: "ca1414"
  },
  infoTicket: {
    color: "Blue"
  },
  resolutionTicket: {
    color: "Blue",
    header: "RESOLUCIÓN DEL TICKET",
    description: function (ticketName) {
      return (`
      - Si lees este mensaje tu ticket de ${ticketName} ha sido cerrado.
      Puedes ver el ticket descargando el archivo de transcript que esta arriba. (.html)
      `)
    }
  },
  logTanscript: {
    color: "Blue",
    title: function (ticketName) {
      return (`
      Se ha cerrado un ticket de ${ticketName}
      `)
    },
    description: function (ticketCreateChannel, userOpenTicket, userCloseTicket, dateOpenTicket, dateCloseTicket) {
      return (`
      **Nombre del ticket:** ${ticketCreateChannel}
      **Usuario que abrio el ticket:** ${userOpenTicket}
      **Usuario que cerró el ticket:** ${userCloseTicket}
      **Apertura del ticket:** ${dateOpenTicket}
      **Cierre del ticket:** ${dateCloseTicket}
      `)
    }
  }
}

module.exports = {
  defaultButtonsConfig,
  defaultEmbedsConfig
}