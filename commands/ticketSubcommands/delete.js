const ActiveTicketsSchema = require("../../schemas/ActiveTicketsSchema")

module.exports = {
  name: "borrar",
  async run (client, interaction) {

    await interaction.reply({ content: `El ticket será borrado en 5 segundos por ${interaction.user}`})

    const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: interaction.channel.id })
    if (ActiveTicketData) await ActiveTicketData.deleteOne()

    setTimeout(() => {
      if (client.channels.cache.get(interaction.channel.id)) interaction.channel.delete().catch((e) => console.log(`No fue posible eliminar un canal de ticket. Probablemente se deba a que ha sido ya eliminado.\nERR: ${e}`))
    }, 5000)
  
  }
}
