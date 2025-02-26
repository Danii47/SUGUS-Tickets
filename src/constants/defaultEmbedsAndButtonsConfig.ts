import { ButtonStyle } from "discord.js"
import { ButtonsConfig } from "../types/CustomTypes"

export const defaultButtonsConfig: ButtonsConfig = {
  close: {
    customId: "close",
    label: " ",
    style: ButtonStyle.Secondary,
    emoji: "🔒",
    disabled: false
  },
  cancelClose: {
    customId: "cancelClose",
    label: "CANCELAR",
    style: ButtonStyle.Secondary,
    emoji: "❌",
    disabled: false
  },
  confirmClose: {
    customId: "confirmClose",
    label: "CERRAR",
    style: ButtonStyle.Danger,
    emoji: "✅",
    disabled: false
  },
  delete: {
    customId: "delete",
    label: " ",
    style: ButtonStyle.Secondary,
    emoji: "🗑️",
    disabled: false
  },
  reopen: {
    customId: "reopen",
    label: " ",
    style: ButtonStyle.Secondary,
    emoji: "🔓",
    disabled: false
  }
}

export const defaultEmbedsConfig = {
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
    description: function (ticketName: string): string {
      return `- Si lees este mensaje tu ticket de ${ticketName} ha sido cerrado.\nPuedes ver el ticket descargando el archivo de transcript que esta arriba. (.html)`
    }
  },
  logTanscript: {
    color: "Blue",
    title: function (ticketName: string): string {
      return `Se ha cerrado un ticket de ${ticketName}`
    },
    description: function (ticketCreateChannel: string, userOpenTicket: string, userCloseTicket: string, dateOpenTicket: string, dateCloseTicket: string): string {
      return `**Nombre del ticket:** ${ticketCreateChannel}\n**Usuario que abrio el ticket:** ${userOpenTicket}\n**Usuario que cerró el ticket:** ${userCloseTicket}\n**Apertura del ticket:** ${dateOpenTicket}\n**Cierre del ticket:** ${dateCloseTicket}`
    }
  }
}