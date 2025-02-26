import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags, ChatInputCommandInteraction, TextChannel } from "discord.js"
import roles from "../configs/rolesId.json"
import { serverName, devId } from "../configs/generalConfig.json"
import { MyClient } from "../types/CustomTypes"

const NAMES_OF_TICKET_FILES = {
  [roles.ctfRoles.everyone]: "ctf",
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("refrescarpanel")
    .setDescription("Refresca el panel que desees [DEVCOMMAND].")
    .addStringOption(op => op
      .setName("panel")
      .setDescription("Panel que deseas refrescar.")
      .setRequired(true)
    ),

  async run(client: MyClient, interaction: ChatInputCommandInteraction) {
    if (!interaction.member) return interaction.reply({ content: "No se ha podido obtener la informacion de miembro.", flags: MessageFlags.Ephemeral })
    if (!interaction.guild) return interaction.reply({ content: "No se ha podido obtener la informacion de servidor.", flags: MessageFlags.Ephemeral })
    
    if (typeof interaction.member.permissions === "string") return interaction.reply({ content: "No se ha podido obtener la informacion de permisos.", flags: MessageFlags.Ephemeral })
    
    if (interaction.user.id != devId && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: "No tienes acceso a usar este comando.", flags: MessageFlags.Ephemeral })
    
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })
    
    const panel = interaction.options.getString("panel")
    if (!panel) return interaction.editReply({ content: "No se ha podido obtener el panel." })

    const guildTicketInfo = require(`../guildTickets/${NAMES_OF_TICKET_FILES[interaction.guild.id]}.ts`)
    
    const panelInfo = guildTicketInfo[panel]
    if (!panelInfo) return interaction.editReply({ content: "El panel que has introducido no existe." })

    const channelToSendEmbed = client.channels.cache.get(panelInfo.openTicketChannelId) as TextChannel
    if (!channelToSendEmbed) return interaction.editReply({ content: "No se ha encontrado el canal donde enviar el panel." })
    
    await channelToSendEmbed.bulkDelete(1)

    const Buttons = require("../constants/buttons")
    
    await channelToSendEmbed.send({
      components: [Buttons.create[panel]],
      embeds: [
        new EmbedBuilder()
          .setTitle(panelInfo.openTicketEmbedTitle)
          .setDescription(panelInfo.openTicketEmbedDescription())
          .setColor(panelInfo.openTicketEmbedColor)
          .setFooter({ text: `${serverName}`, iconURL: client.user?.avatarURL() || undefined })
          .setTimestamp()
      ]
    })
    await interaction.editReply({ content: `Se ha refrescado el panel de ${panel}.` })
  }
}