import { ChatInputCommandInteraction, GuildMember, MessageFlags, TextChannel } from "discord.js"
import ActiveTicketsSchema from "../../schemas/ActiveTicketsSchema"
import { RolePermission } from "../../types/CustomTypes"

export default {
  name: "quitar",
  async run(_: any, interaction: ChatInputCommandInteraction) {

    const member = interaction.options.getMember("usuario") as GuildMember
    const role = interaction.options.getRole("rol")

    if (!member && !role) return interaction.reply({ content: "Debes seleccionar una de las dos opciones para añadir.", flags: MessageFlags.Ephemeral })

    const channelToRemoveUser = interaction.channel as TextChannel
    if (!channelToRemoveUser) return interaction.reply({ content: "No se ha podido obtener el canal.", flags: MessageFlags.Ephemeral })

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

    const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: channelToRemoveUser.id })
    if (ActiveTicketData?.ticketInfo) {
      await ActiveTicketData.updateOne({
        ticketInfo: {
          ...ActiveTicketData.ticketInfo,
          permissions: ActiveTicketData.ticketInfo.permissions.filter((permission: RolePermission) => {
            if (member && role) return permission.id !== member.id && permission.id !== role.id
            if (member) return permission.id !== member.id
            if (role) return permission.id !== role.id
          })
        }
      })
    }
  }
}
