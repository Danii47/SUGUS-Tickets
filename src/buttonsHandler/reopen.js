const { EmbedBuilder } = require("discord.js")
const { defaultEmbedsConfig, defaultButtonsConfig } = require("../constants/defaultEmbedsAndButtonsConfig")
const ActiveTicketsSchema = require("../schemas/ActiveTicketsSchema")

const Buttons = require("../constants/buttons")

module.exports = {
  async buttonHandlerFunction(_, interaction) {

    if (interaction.customId !== defaultButtonsConfig.reopen.customId) return

    await interaction.deferUpdate()

    const channelMessages = await interaction.channel.messages.fetch()
      .catch((e) => console.log(`Ocurrió un error al intentar recuperar los mensajes del canal. Probablemente no existe el embed inicial o fue borrado.\nERR: ${e}`))

    try {
      const initialEmbed = Array.from(channelMessages.values()).pop()
      initialEmbed.components[0].components[0].data.disabled = false
      await initialEmbed.edit({
        components: initialEmbed.components
      })
    } catch (e) {
      console.log(`Ocurrió un error al intentar reactivar el botón de cerrar.\nERR: ${e}`)
    }

    const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: interaction.channel.id })
    
    if (ActiveTicketData?.userId) {
      await interaction.channel.permissionOverwrites.edit(ActiveTicketData.userId, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
        AttachFiles: true,
      })
    }
    await interaction.channel.edit({ name: `${interaction.channel.name.replace("✅", "")}` })

    await interaction.message.delete()
      .catch((e) => console.log(`Ocurrió un error al intentar borrar el mensaje de confirmación de cierre de ticket. Probablemente dos usuarios intentaron reabrir el ticket a la vez.\nERR: ${e}}`))

  }
}
