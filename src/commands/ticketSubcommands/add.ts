import { ChatInputCommandInteraction, GuildMember, MessageFlags, TextChannel } from "discord.js"
import ActiveTicketsSchema from "../../schemas/ActiveTicketsSchema"

export default {
  name: "añadir",
  async run(_: any, interaction: ChatInputCommandInteraction) {

    const member = interaction.options.getMember("usuario") as GuildMember
    const role = interaction.options.getRole("rol")

    if (!member && !role) return interaction.reply({ content: "Debes seleccionar una de las dos opciones para añadir.", flags: MessageFlags.Ephemeral })

    const channelToAddUser = interaction.channel as TextChannel
    if (!channelToAddUser) return interaction.reply({ content: "No se ha podido obtener el canal.", flags: MessageFlags.Ephemeral })

    const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: channelToAddUser.id })


    if (member) {

      await channelToAddUser.permissionOverwrites.edit(member.user.id, {
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
