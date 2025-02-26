import { ButtonInteraction, TextChannel } from "discord.js"
import { MyClient } from "../types/CustomTypes"
import { defaultButtonsConfig } from "../constants/defaultEmbedsAndButtonsConfig"
import ActiveTicketsSchema from "../schemas/ActiveTicketsSchema"
import { Buttons } from "../constants/buttons"

export default {
  async buttonHandlerFunction(client: MyClient, interaction: ButtonInteraction) {

    if (interaction.customId !== defaultButtonsConfig.delete.customId) return

    const channel = interaction.channel as TextChannel
    if (!channel) return interaction.reply({ content: "No se ha podido obtener el canal.", ephemeral: true })

    const newButton = Buttons.close.components[0].setDisabled(true)
    const newActionRow = { type: 1, components: [newButton] }
    await interaction.message.edit({
      components: [newActionRow]
    })

    const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: channel.id })

    if (ActiveTicketData) await ActiveTicketData.deleteOne()

    await interaction.reply({ content: `El ticket será borrado en 5 segundos por ${interaction.user}` })

    setTimeout(() => {
      if (client.channels.cache.get(channel.id)) channel.delete().catch((e) => console.log(`No fue posible eliminar un canal de ticket. Probablemente se deba a que ha sido ya eliminado.\nERR: ${e}`))
    }, 5000)
  }
}
