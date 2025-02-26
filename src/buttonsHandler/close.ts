import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ColorResolvable, EmbedBuilder, MessageFlags, TextChannel, User } from "discord.js"
import { defaultEmbedsConfig, defaultButtonsConfig } from "../constants/defaultEmbedsAndButtonsConfig"
import { serverName } from "../configs/generalConfig.json"
import { Buttons } from "../constants/buttons"
import { createTranscript } from "discord-html-transcripts"
import ActiveTicketsSchema from "../schemas/ActiveTicketsSchema"
import moment from "moment"
import { MyClient } from "../types/CustomTypes"
moment.locale("es")

export async function buttonHandlerFunction(client: MyClient, interaction: ButtonInteraction) {

  if (interaction.customId !== defaultButtonsConfig.close.customId) return

  if (!client.user) return interaction.reply({ content: "No se ha podido obtener la información del bot.", flags: MessageFlags.Ephemeral })

  const channel = interaction.channel as TextChannel
  if (!channel) return interaction.reply({ content: "No se ha podido obtener el canal.", flags: MessageFlags.Ephemeral })

  if (!interaction.guild) return interaction.reply({ content: "No se ha podido obtener la información del servidor.", flags: MessageFlags.Ephemeral })

  const newButton = new ButtonBuilder(Buttons.close.components[0].data).setDisabled(true)
  const newActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(newButton)

  await interaction.message.edit({
    components: [newActionRow]
  })

  await interaction.deferUpdate()

  const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: channel.id })

  
  const sentMessagesInChannel = await channel.messages.fetch()
  const sentMessagesInChannelArray = Array.from(sentMessagesInChannel.values())
  const formattedMessagesInChannel = sentMessagesInChannelArray.map(message => {
    const offset = moment(message.createdTimestamp).isDST() ? "+0200" : "+0100"
    return {
      author: `${message.author} (${message.author.username} ${message.author.globalName})`,
      date: `${moment(message.createdTimestamp).utcOffset(offset).format('llll')}`
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

  const ticketTranscriptName = `${(ActiveTicketData?.ticketInfo?.name) ? `${channel.name}.html` : `${channel.name}.html`}`
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

  const member = interaction.guild.members.cache.get(ActiveTicketData?.userId || "")
  const channelTranscripts = client.channels.cache.get(ActiveTicketData?.ticketInfo?.channelTranscriptsId) as TextChannel

  if (channelTranscripts) channelTranscripts.send({
    embeds: [
      new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() || undefined })
        .setColor(defaultEmbedsConfig.logTanscript.color as ColorResolvable)
        .setTitle(defaultEmbedsConfig.logTanscript.title(ActiveTicketData?.ticketInfo?.name || "TRANSCRIPT"))
        .setDescription(defaultEmbedsConfig.logTanscript.description(
          channel.name,
          member ? `${member} (${member.user.username})` : "Usuario desconocido",
          `${interaction.user} (${interaction.user.username})`,
          formattedMessagesInChannel[formattedMessagesInChannel.length - 1].date,
          formattedMessagesInChannel[0].date
        ))
        .setFooter({ text: serverName, iconURL: interaction.guild.iconURL() || undefined })
        .setTimestamp()
    ], files: [transcriptAttachment]
  })


  if (member) member.user.send({
    files: [transcriptAttachment],
    embeds: [
      new EmbedBuilder()
        .setColor(defaultEmbedsConfig.resolutionTicket.color as ColorResolvable)
        .setAuthor({ name: defaultEmbedsConfig.resolutionTicket.header, iconURL: client.user.avatarURL() || undefined })
        .setDescription(defaultEmbedsConfig.resolutionTicket.description(ActiveTicketData?.ticketInfo.name))
        .setThumbnail(client.user.avatarURL()),
      new EmbedBuilder()
        .setColor(defaultEmbedsConfig.infoTicket.color as ColorResolvable)
        .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL() || undefined })
        .addFields(
          { name: 'Propietario del Ticket', value: `${member.user} (${member.user.username})`, inline: true },
          { name: 'Nombre del Ticket', value: `${channel.name}`, inline: true },
          { name: 'Nombre de Categoría', value: `${(!channel.parent) ? "Sin categoría" : channel.parent.name}`, inline: true },
          { name: 'Usuarios que han participado en el ticket', value: `${usersParticipateInTicket.join('\n') || "-"}`, inline: true },
          { name: 'El ticket se abre', value: `${formattedMessagesInChannel[formattedMessagesInChannel.length - 1].date}`, inline: true },
          { name: 'El ticket se cierra', value: `${formattedMessagesInChannel[0].date}`, inline: true }
        )
        .setFooter({ text: serverName, iconURL: client.user.avatarURL() || undefined })
        .setTimestamp()
    ]
  }).catch((_) => console.log(`[TICKETS] No fue posible enviarle los datos del ticket a ${member.user.username}. MDs desactivados. Ticket: ${channel.name}`))

}
