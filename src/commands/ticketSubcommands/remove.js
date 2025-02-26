const { EmbedBuilder, MessageFlags } = require("discord.js")
const ActiveTicketsSchema = require("../../schemas/ActiveTicketsSchema")

module.exports = {
  name: "quitar",
  async run(_, interaction) {

    const member = interaction.options.getMember("usuario")
    const role = interaction.options.getRole("rol")

    if (!member && !role) return interaction.reply({ content: "Debes seleccionar una de las dos opciones para añadir.", flags: MessageFlags.Ephemeral })

    const channelToRemoveUser = interaction.channel

    if (member) {
      await channelToRemoveUser.permissionOverwrites.delete(member.id)
      await interaction.reply({
        content: `📥 El usuario ${member} ha sido eliminado del ticket.`,
        flags: MessageFlags.Ephemeral
      })
    }

    if (role) {
      await channelToRemoveUser.permissionOverwrites.delete(role.id)

      await interaction.reply({
        content: `📥 El rol ${role} ha sido eliminado del ticket.`,
        flags: MessageFlags.Ephemeral
      })
    }

    const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: interaction.channel.id })
    if (ActiveTicketData?.ticketInfo) {
      await ActiveTicketData.updateOne({
        ticketInfo: {
          ...ActiveTicketData.ticketInfo,
          permissions: ActiveTicketData.ticketInfo.permissions.filter((permission) => {
            if (member && role) return permission.id !== member.id && permission.id !== role.id
            if (member) return permission.id !== member.id
            if (role) return permission.id !== role.id
          })
        }
      })
    }
  }
}
