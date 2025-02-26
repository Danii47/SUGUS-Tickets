import { PermissionFlagsBits, SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, TextChannel, Message } from "discord.js"

export default {
  data: new SlashCommandBuilder()
    .setName("borrar")
    .setDescription("Borra mensajes. (la antigüedad de estos deberá ser menor a 14 días)")
    .addIntegerOption(op => op
      .setName("cantidad")
      .setDescription("Número de mensajes que quieres borrar.")
      .setRequired(true)
    )
    .addUserOption(op => op
      .setName("usuario")
      .setDescription("Borrra mensajes de un usuario concreto.")
      .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async run(_: any, interaction: ChatInputCommandInteraction) {

    const user = interaction.options.getUser("usuario")
    const ammount = interaction.options.getInteger("cantidad")

    if (!ammount) return interaction.reply({ content: "No se ha podido obtener la cantidad de mensajes a borrar.", flags: MessageFlags.Ephemeral })
    
    const channel = interaction.channel as TextChannel
    if (!channel) return interaction.reply({ content: "No se ha podido obtener el canal.", flags: MessageFlags.Ephemeral })
    
    let ammountEditable = ammount
    await interaction.deferReply({ ephemeral: false })
    await interaction.deleteReply()


    if (ammount <= 0) return interaction.followUp({ content: `**${interaction.user.username}** debes poner un número superior a 0.`, flags: MessageFlags.Ephemeral })

    if (!user) {
      while (true) {
        if (ammountEditable <= 100) {
          await channel.bulkDelete(ammountEditable).catch(_ => {
            return interaction.followUp({ content: `**${interaction.user.username}** por limitaciones de Discord no es posible eliminar mensajes con una antigüedad superior a 14 días.`, flags: MessageFlags.Ephemeral })
          })
          break
        }

        await channel.bulkDelete(100).catch(_ => {
          return interaction.followUp({ content: `**${interaction.user.username}** por limitaciones de Discord no es posible eliminar mensajes con una antigüedad superior a 14 días.`, flags: MessageFlags.Ephemeral })
        })

        ammountEditable -= 100
      }
    } else {
      let i = 0
      let messagesToBulk: Message[] = []
      const fetchedMessages = await channel.messages.fetch()
      fetchedMessages.filter((m) => {
        if (m.author.id === user.id && ammount > i) {
          messagesToBulk.push(m)
          i++
        }
      })
      await channel.bulkDelete(messagesToBulk, true).catch(_ => {
        return interaction.followUp({ content: `**${interaction.user.username}** por limitaciones de Discord no es posible eliminar mensajes con una antigüedad superior a 14 días.`, flags: MessageFlags.Ephemeral })
      })
    }
  }

}