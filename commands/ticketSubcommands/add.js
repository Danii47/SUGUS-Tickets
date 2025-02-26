const { EmbedBuilder, MessageFlags } = require("discord.js")
const ActiveTicketsSchema = require("../../schemas/ActiveTicketsSchema")

module.exports = {
  name: "añadir",
  async run(_, interaction) {

    const member = interaction.options.getMember("usuario")
    const role = interaction.options.getRole("rol")

    if (!member && !role) return interaction.reply({ content: "Debes seleccionar una de las dos opciones para añadir.", flags: MessageFlags.Ephemeral })

    const channelToAddUser = interaction.channel

    const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: interaction.channel.id })


    if (member) {

      await channelToAddUser.permissionOverwrites.edit(member.id, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
        AttachFiles: true
      })

      await interaction.reply({
        content: `📥 El usuario ${member} ha sido añadido al ticket.`,
        flags: MessageFlags.Ephemeral
      })

      if (ActiveTicketData?.ticketInfo) {

        await ActiveTicketData.updateOne({
          ticketInfo: {
            ...ActiveTicketData.ticketInfo,
            permissions: [
              ...ActiveTicketData.ticketInfo.permissions,
              { id: member.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles'] },

            ]
          }
        })
      }
    }

    if (role) {

      await channelToAddUser.permissionOverwrites.edit(role.id, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
        AttachFiles: true
      })

      await interaction.reply({
        content: `📥 El rol ${role} ha sido añadido al ticket.`,
        flags: MessageFlags.Ephemeral
      })

      if (ActiveTicketData?.ticketInfo) {

        await ActiveTicketData.updateOne({
          ticketInfo: {
            ...ActiveTicketData.ticketInfo,
            permissions: [
              ...ActiveTicketData.ticketInfo.permissions,
              { id: role.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles'] },

            ]
          }
        })
      }
    }
  }
}
