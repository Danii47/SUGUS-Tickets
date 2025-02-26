const { defaultButtonsConfig } = require("../constants/defaultEmbedsAndButtonsConfig")
const ActiveTicketsSchema = require("../schemas/ActiveTicketsSchema")

module.exports = {
  async buttonHandlerFunction(client, interaction) {

    if (interaction.customId !== defaultButtonsConfig.delete.customId) return

    interaction.component.data.disabled = true
    await interaction.message.edit({
      components: interaction.message.components
    })

    const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: interaction.channel.id })

    if (ActiveTicketData) await ActiveTicketData.deleteOne()

    await interaction.reply({ content: `El ticket será borrado en 5 segundos por ${interaction.user}` })

    setTimeout(() => {
      if (client.channels.cache.get(interaction?.channel?.id)) interaction.channel.delete().catch((e) => console.log(`No fue posible eliminar un canal de ticket. Probablemente se deba a que ha sido ya eliminado.\nERR: ${e}`))
    }, 5000)
  }
}
