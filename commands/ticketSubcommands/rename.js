const { MessageFlags } = require("discord.js")

module.exports = {
  name: "renombrar",
  async run(_, interaction) {

    const ticketNumber = interaction.options.getString("ticket")
    let pushValue = interaction.options.getString("valorañadido")

    if (pushValue[0] === " ") pushValue = pushValue.slice(1)

    const channelName = interaction.channel.name

    if (channelName.includes(ticketNumber)) {

      await interaction.channel.edit({ name: `${channelName}${pushValue}` })
      await interaction.reply({ content: "Ticket renombrado correctamente.", flags: MessageFlags.Ephemeral })

    } else await interaction.reply({ content: "El canal que intentas cambiar de nombre parece que no es un ticket o no contiene el Nº introducido. En caso contrario, contacta con un moderador para que lo renombre.", flags: MessageFlags.Ephemeral })

  }
}
