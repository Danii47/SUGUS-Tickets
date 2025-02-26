const { EmbedBuilder, MessageFlags } = require("discord.js")
const { defaultEmbedsConfig } = require("../../constants/defaultEmbedsAndButtonsConfig")
const { serverName } = require("../../configs/generalConfig.json")
const Buttons = require("../../constants/buttons")
const discordTranscripts = require("discord-html-transcripts")
const moment = require("moment")
const ActiveTicketsSchema = require("../../schemas/ActiveTicketsSchema")

module.exports = {
  name: "cerrar",
  async run(client, interaction) {
    const ticketNumber = interaction.options.getString("ticket")
    const channelName = interaction.channel.name

    if (!channelName.includes(ticketNumber)) return interaction.reply({ content: "Parece que el canal donde estas ejecutando el comando no es el canal del ticket.", flags: MessageFlags.Ephemeral })

    const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: interaction.channel.id })

    const sentMessagesInChannel = await interaction.channel.messages.fetch()
    const sentMessagesInChannelArray = Array.from(sentMessagesInChannel.values())
    const formattedMessagesInChannel = sentMessagesInChannelArray.map(message => {
      return {
        author: `${message.author} (${message.author.username} ${message.author.globalName})`,
        date: `${moment(message.createdTimestamp).format('llll')}`
      }
    })

    const usersParticipateInTicket = []
    sentMessagesInChannelArray.forEach((message) => {
      if (!usersParticipateInTicket.includes(message.author) && message.author.id !== client.user.id) usersParticipateInTicket.push(message.author)
    })
    const ticketTranscriptName = `${(ActiveTicketData?.ticketInfo?.name) ? `${ActiveTicketData.ticketInfo.name}-${interaction.channel.name}.html` : `${interaction.channel.name}.html`}`
    const transcriptAttachment = await discordTranscripts.createTranscript(interaction.channel, opts = { filename: ticketTranscriptName })

    if (ActiveTicketData?.ticketInfo) interaction.channel.permissionOverwrites.set(ActiveTicketData.ticketInfo.permissions)
    interaction.channel.edit({ name: `${interaction.channel.name}✅` })

    await interaction.channel.send({
      content: "**Transcript del ticket**",
      components: [Buttons.delete],
      embeds: [
        new EmbedBuilder()
          .setDescription(`⛔ **El ticket ha sido cerrado por ${interaction.user}**`)
          .setColor(defaultEmbedsConfig.deleteTicket.color)
      ],
      files: [transcriptAttachment]
    })

    const channelTranscripts = client.channels.cache.get(ActiveTicketData?.ticketInfo?.channelTranscriptsId)
    if (channelTranscripts) channelTranscripts.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
          .setColor(defaultEmbedsConfig.logTanscript.color)
          .setTitle(defaultEmbedsConfig.logTanscript.title(ActiveTicketData?.ticketInfo?.name || "TRANSCRIPT"))
          .setDescription(defaultEmbedsConfig.logTanscript.description(
            interaction.channel.name,
            ` ()`,
            `${interaction.user} (${interaction.user.username})`,
            formattedMessagesInChannel[0].date,
            formattedMessagesInChannel[formattedMessagesInChannel.length - 1].date
          ))
          .setFooter({ text: serverName, iconURL: interaction.guild.iconURL() })
          .setTimestamp()
      ], files: [transcriptAttachment]
    })

    const member = interaction.guild.members.cache.get(ActiveTicketData?.userId)

    if (member) member.user.send({
      files: [transcriptAttachment], embeds: [
        new EmbedBuilder()
          .setColor(defaultEmbedsConfig.resolutionTicket.color)
          .setAuthor({ name: defaultEmbedsConfig.resolutionTicket.header, iconURL: interaction.guild.iconURL() })
          .setDescription(defaultEmbedsConfig.resolutionTicket.description(ActiveTicketData.ticketInfo.name))
          .setThumbnail(interaction.guild.iconURL()),
        new EmbedBuilder()
          .setColor(defaultEmbedsConfig.infoTicket.color)
          .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL() })
          .addFields(
            { name: 'Propietario del Ticket', value: `${member.user} (${member.user.username})`, inline: true },
            { name: 'Nombre del Ticket', value: `${interaction.channel.name}`, inline: true },
            { name: 'Nombre de Categoría', value: `${(!interaction.channel.parent) ? "Sin categoría" : interaction.channel.parent.name}`, inline: true },
            { name: 'Usuarios que han participado en el ticket', value: `${usersParticipateInTicket.join('\n') || "-"}`, inline: true },
            { name: 'El ticket se abre', value: `${formattedMessagesInChannel[0].date}`, inline: true },
            { name: 'El ticket se cierra', value: `${formattedMessagesInChannel[formattedMessagesInChannel.length - 1].date}`, inline: true }
          )
          .setFooter({ text: serverName, iconURL: interaction.guild.iconURL() })
          .setTimestamp()
      ]
    }).catch((_) => console.log(`[TICKETS] No fue posible enviarle los datos del ticket a ${member.user.username}. MDs desactivados. Ticket: ${interaction.channel.name}`))

    if (ActiveTicketData) await ActiveTicketData.deleteOne()

    await interaction.reply({ content: "Ticket cerrado correctamente.", flags: MessageFlags.Ephemeral })
  }
}
