import { MessageFlags, ChatInputCommandInteraction, TextChannel } from "discord.js"

export default {
  name: "renombrar",
  async run(_: any, interaction: ChatInputCommandInteraction) {

    const ticketNumber = interaction.options.getString("ticket")
    let pushValue = interaction.options.getString("valorañadido")?.trimStart()

    if (!ticketNumber) return interaction.reply({ content: "No se ha podido obtener el número de ticket.", flags: MessageFlags.Ephemeral })
    if (!pushValue) return interaction.reply({ content: "No se ha podido obtener el valor añadido.", flags: MessageFlags.Ephemeral })
    if (!interaction.channel) return interaction.reply({ content: "No se ha podido obtener el canal.", flags: MessageFlags.Ephemeral })
  
    const channel = interaction.channel as TextChannel

    if (channel.name.includes(ticketNumber)) {

      await channel.edit({ name: `${channel.name}${pushValue}` })
      await interaction.reply({ content: "Ticket renombrado correctamente.", flags: MessageFlags.Ephemeral })

    } else await interaction.reply({ content: "El canal que intentas cambiar de nombre parece que no es un ticket o no contiene el Nº introducido. En caso contrario, contacta con un administrador para que lo renombre.", flags: MessageFlags.Ephemeral })

  }
}
