const { EmbedBuilder } = require("discord.js")
const { defaultEmbedsConfig, defaultButtonsConfig } = require("../constants/defaultEmbedsAndButtonsConfig")
const { serverName } = require("../configs/generalConfig.json")
const Buttons = require("../constants/buttons")
const discordTranscripts = require("discord-html-transcripts")
const ActiveTicketsSchema = require("../schemas/ActiveTicketsSchema")
const moment = require("moment")
moment.locale("es")

module.exports = {
  async buttonHandlerFunction(client, interaction) {

    if (interaction.customId !== defaultButtonsConfig.close.customId) return
    
    interaction.component.data.disabled = true
    await interaction.message.edit({
      components: interaction.message.components
    })
    await interaction.deferUpdate()

    const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: interaction.channel.id })

    const sentMessagesInChannel = await interaction.channel.messages.fetch()
    const sentMessagesInChannelArray = Array.from(sentMessagesInChannel.values())
    const formattedMessagesInChannel = sentMessagesInChannelArray.map(message => {
      return {
        author: `${message.author} (${message.author.username} ${message.author.globalName})`,
        date: `${moment(message.createdTimestamp).utcOffset("+0200").format('llll')}`
      }
    })

    const usersParticipateInTicket = []
    sentMessagesInChannelArray.forEach((message) => {
      if (!usersParticipateInTicket.includes(message.author) && message.author.id !== client.user.id) usersParticipateInTicket.push(message.author)
    })
    const ticketTranscriptName = `${(ActiveTicketData?.ticketInfo?.name) ? `${interaction.channel.name}.html` : `${interaction.channel.name}.html`}`
    const transcriptAttachment = await discordTranscripts.createTranscript(interaction.channel, opts = { filename: ticketTranscriptName })

    if (ActiveTicketData?.ticketInfo) interaction.channel.permissionOverwrites.set(ActiveTicketData.ticketInfo.permissions)
    interaction.channel.edit({ name: `${interaction.channel.name}✅` })
    
    await interaction.channel.send({
      content: "**Transcript del ticket**",
      components: [Buttons.deleteAndReopen],
      embeds: [
        new EmbedBuilder()
          .setDescription(`⛔ **El ticket ha sido cerrado por ${interaction.user}**`)
          .setColor(defaultEmbedsConfig.deleteTicket.color)
      ],
      files: [transcriptAttachment]
    })

    const member = interaction.guild.members.cache.get(ActiveTicketData?.userId)
    const channelTranscripts = client.channels.cache.get(ActiveTicketData?.ticketInfo?.channelTranscriptsId)

    if (channelTranscripts) channelTranscripts.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
          .setColor(defaultEmbedsConfig.logTanscript.color)
          .setTitle(defaultEmbedsConfig.logTanscript.title(ActiveTicketData?.ticketInfo?.name || "TRANSCRIPT"))
          .setDescription(defaultEmbedsConfig.logTanscript.description(
            interaction.channel.name,
            member ? `${member} (${member.user.username})` : "Usuario desconocido",
            `${interaction.user} (${interaction.user.username})`,
            formattedMessagesInChannel[formattedMessagesInChannel.length - 1].date,
            formattedMessagesInChannel[0].date
          ))
          .setFooter({ text: serverName, iconURL: interaction.guild.iconURL() })
          .setTimestamp()
      ], files: [transcriptAttachment]
    })


    if (member) member.user.send({
      files: [transcriptAttachment], embeds: [
        new EmbedBuilder()
          .setColor(defaultEmbedsConfig.resolutionTicket.color)
          .setAuthor({ name: defaultEmbedsConfig.resolutionTicket.header, iconURL: client.user.avatarURL() })
          .setDescription(defaultEmbedsConfig.resolutionTicket.description(ActiveTicketData.ticketInfo.name))
          .setThumbnail(client.user.avatarURL()),
        new EmbedBuilder()
          .setColor(defaultEmbedsConfig.infoTicket.color)
          .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL() })
          .addFields(
            { name: 'Propietario del Ticket', value: `${member.user} (${member.user.username})`, inline: true },
            { name: 'Nombre del Ticket', value: `${interaction.channel.name}`, inline: true },
            { name: 'Nombre de Categoría', value: `${(!interaction.channel.parent) ? "Sin categoría" : interaction.channel.parent.name}`, inline: true },
            { name: 'Usuarios que han participado en el ticket', value: `${usersParticipateInTicket.join('\n') || "-"}`, inline: true },
            { name: 'El ticket se abre', value: `${formattedMessagesInChannel[formattedMessagesInChannel.length - 1].date}`, inline: true },
            { name: 'El ticket se cierra', value: `${formattedMessagesInChannel[0].date}`, inline: true }
          )
          .setFooter({ text: serverName, iconURL: client.user.avatarURL() })
          .setTimestamp()
      ]
    }).catch((_) => console.log(`[TICKETS] No fue posible enviarle los datos del ticket a ${member.user.username}. MDs desactivados. Ticket: ${interaction.channel.name}`))

  }
}
