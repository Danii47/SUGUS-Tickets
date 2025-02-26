import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, MessageFlags, TextChannel, User } from "discord.js"
import { defaultEmbedsConfig } from "../../constants/defaultEmbedsAndButtonsConfig"
import { serverName } from "../../configs/generalConfig.json"
import { Buttons } from "../../constants/buttons"
import { createTranscript } from "discord-html-transcripts"
import moment from "moment"
import ActiveTicketsSchema from "../../schemas/ActiveTicketsSchema"
import { MyClient } from "../../types/CustomTypes"

export default {
  name: "cerrar",
  async run(client: MyClient, interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return interaction.reply({ content: "No se ha podido obtener la información del servidor.", flags: MessageFlags.Ephemeral })

    const ticketNumber = interaction.options.getString("ticket")
    if (!ticketNumber) return interaction.reply({ content: "No se ha podido obtener el número de ticket.", flags: MessageFlags.Ephemeral })

    const channel = interaction.channel as TextChannel
    if (!channel) return interaction.reply({ content: "No se ha podido obtener el canal.", flags: MessageFlags.Ephemeral })

    if (!channel.name.includes(ticketNumber)) return interaction.reply({ content: "Parece que el canal donde estas ejecutando el comando no es el canal del ticket.", flags: MessageFlags.Ephemeral })

    const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: channel.id })

    const sentMessagesInChannel = await channel.messages.fetch()
    const sentMessagesInChannelArray = Array.from(sentMessagesInChannel.values())
    const formattedMessagesInChannel = sentMessagesInChannelArray.map(message => {
      return {
        author: `${message.author} (${message.author.username} ${message.author.globalName})`,
        date: `${moment(message.createdTimestamp).format('llll')}`
      }
    })

    const usersParticipateInTicket: User[] = []

    sentMessagesInChannelArray.forEach((message) => {
      if (
        client.user &&
        !usersParticipateInTicket.includes(message.author) &&
        message.author.id !== client.user.id
      ) usersParticipateInTicket.push(message.author)
    })
    
    const ticketTranscriptName = `${(ActiveTicketData?.ticketInfo?.name) ? `${ActiveTicketData.ticketInfo.name}-${channel.name}.html` : `${channel.name}.html`}`
    const transcriptAttachment = await createTranscript(channel, { filename: ticketTranscriptName, limit: -1 })

    if (ActiveTicketData?.ticketInfo) channel.permissionOverwrites.set(ActiveTicketData.ticketInfo.permissions)
    channel.edit({ name: `${channel.name}✅` })

    await channel.send({
      content: "**Transcript del ticket**",
      components: [Buttons.deleteAndReopen],
      embeds: [
        new EmbedBuilder()
          .setDescription(`⛔ **El ticket ha sido cerrado por ${interaction.user}**`)
          .setColor(defaultEmbedsConfig.deleteTicket.color as ColorResolvable)
      ],
      files: [transcriptAttachment]
    })

    const channelTranscripts = client.channels.cache.get(ActiveTicketData?.ticketInfo?.channelTranscriptsId) as TextChannel
    if (channelTranscripts) channelTranscripts.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() || undefined })
          .setColor(defaultEmbedsConfig.logTanscript.color as ColorResolvable)
          .setTitle(defaultEmbedsConfig.logTanscript.title(ActiveTicketData?.ticketInfo?.name || "TRANSCRIPT"))
          .setDescription(defaultEmbedsConfig.logTanscript.description(
            channel.name,
            ` ()`,
            `${interaction.user} (${interaction.user.username})`,
            formattedMessagesInChannel[0].date,
            formattedMessagesInChannel[formattedMessagesInChannel.length - 1].date
          ))
          .setFooter({ text: serverName, iconURL: interaction.guild.iconURL() || undefined })
          .setTimestamp()
      ], files: [transcriptAttachment]
    })

    const member = interaction.guild.members.cache.get(ActiveTicketData?.userId || "")

    if (member) member.user.send({
      files: [transcriptAttachment], embeds: [
        new EmbedBuilder()
          .setColor(defaultEmbedsConfig.resolutionTicket.color as ColorResolvable)
          .setAuthor({ name: defaultEmbedsConfig.resolutionTicket.header, iconURL: interaction.guild.iconURL() || undefined })
          .setDescription(defaultEmbedsConfig.resolutionTicket.description(ActiveTicketData?.ticketInfo.name))
          .setThumbnail(interaction.guild.iconURL()),
        new EmbedBuilder()
          .setColor(defaultEmbedsConfig.infoTicket.color as ColorResolvable)
          .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL() || undefined })
          .addFields(
            { name: 'Propietario del Ticket', value: `${member.user} (${member.user.username})`, inline: true },
            { name: 'Nombre del Ticket', value: `${channel.name}`, inline: true },
            { name: 'Nombre de Categoría', value: `${(!channel.parent) ? "Sin categoría" : channel.parent.name}`, inline: true },
            { name: 'Usuarios que han participado en el ticket', value: `${usersParticipateInTicket.join('\n') || "-"}`, inline: true },
            { name: 'El ticket se abre', value: `${formattedMessagesInChannel[0].date}`, inline: true },
            { name: 'El ticket se cierra', value: `${formattedMessagesInChannel[formattedMessagesInChannel.length - 1].date}`, inline: true }
          )
          .setFooter({ text: serverName, iconURL: interaction.guild.iconURL() || undefined })
          .setTimestamp()
      ]
    }).catch((_) => console.log(`[TICKETS] No fue posible enviarle los datos del ticket a ${member.user.username}. MDs desactivados. Ticket: ${channel.name}`))

    if (ActiveTicketData) await ActiveTicketData.deleteOne()

    await interaction.reply({ content: "Ticket cerrado correctamente.", flags: MessageFlags.Ephemeral })
  }
}
