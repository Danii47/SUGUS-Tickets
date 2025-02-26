import { ChatInputCommandInteraction, TextChannel } from "discord.js"
import ActiveTicketsSchema from "../../schemas/ActiveTicketsSchema"
import { MyClient } from "../../types/CustomTypes"

export default {
  name: "borrar",
  async run(client: MyClient, interaction: ChatInputCommandInteraction) {
    const channel = interaction.channel as TextChannel

    if (!channel) return await interaction.reply({ content: "No se ha podido obtener el canal.", ephemeral: true })

    await interaction.reply({ content: `El ticket será borrado en 5 segundos por ${interaction.user}` })

    const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: channel.id })
    if (ActiveTicketData) await ActiveTicketData.deleteOne()

    setTimeout(() => {
      if (client.channels.cache.get(channel.id)) channel.delete().catch((e) => console.log(`No fue posible eliminar un canal de ticket. Probablemente se deba a que ha sido ya eliminado.\nERR: ${e}`))
    }, 5000)

  }
}
