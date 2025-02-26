const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js")
const roles = require("../configs/rolesId.json")
const { serverName, devId } = require("../configs/generalConfig.json")

const NAMES_OF_TICKET_FILES = {
  [roles.ctfRoles.everyone]: "ctf",
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("refrescarpanel")
    .setDescription("Refresca el panel que desees [DEVCOMMAND].")
    .setDMPermission(false)
    .addStringOption(op => op
      .setName("panel")
      .setDescription("Panel que deseas refrescar.")
      .setRequired(true)
    ),

  async run(client, interaction) {
    if (interaction.user.id != devId && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: "No tienes acceso a usar este comando.", flags: MessageFlags.Ephemeral })
    
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })
    
    const panel = interaction.options.getString("panel")
    const guildTicketInfo = require(`../guildTickets/${NAMES_OF_TICKET_FILES[interaction.guild.id]}.js`)
    const panelInfo = guildTicketInfo[panel]

    if (!panelInfo) return interaction.editReply({ content: "El panel que has introducido no existe.", flags: MessageFlags.Ephemeral })

    const channelToSendEmbed = client.channels.cache.get(panelInfo.openTicketChannelId)

    if (!channelToSendEmbed) return interaction.editReply({ content: "No se ha encontrado el canal donde enviar el panel.", flags: MessageFlags.Ephemeral })
    else {
      await channelToSendEmbed.bulkDelete(1)
      const Buttons = require("../constants/buttons")
      await channelToSendEmbed.send({
        components: [Buttons.create[panel]],
        embeds: [
          new EmbedBuilder()
            .setTitle(panelInfo.openTicketEmbedTitle)
            .setDescription(panelInfo.openTicketEmbedDescription())
            .setColor(panelInfo.openTicketEmbedColor)
            .setFooter({ text: `${serverName}`, iconURL: client.user.avatarURL() })
            .setTimestamp()
        ]
      })
      await interaction.editReply({ content: `Se ha refrescado el panel de ${panel}.`, flags: MessageFlags.Ephemeral })
    }
  }
}