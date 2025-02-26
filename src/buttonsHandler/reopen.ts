import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, MessageFlags, TextChannel } from "discord.js"
import { defaultButtonsConfig } from "../constants/defaultEmbedsAndButtonsConfig"
import ActiveTicketsSchema from "../schemas/ActiveTicketsSchema"
import { Buttons } from "../constants/buttons"

export async function buttonHandlerFunction(_: any, interaction: ButtonInteraction) {

  if (interaction.customId !== defaultButtonsConfig.reopen.customId) return

  const channel = interaction.channel as TextChannel

  if (!channel) return interaction.reply({ content: "No se ha podido obtener el canal.", flags: MessageFlags.Ephemeral })

  await interaction.deferUpdate()

  const channelMessages = await channel.messages.fetch()
    .catch((e) => console.log(`Ocurrió un error al intentar recuperar los mensajes del canal. Probablemente no existe el embed inicial o fue borrado.\nERR: ${e}`))

  if (!channelMessages) return
  
  try {
    const initialEmbed = Array.from(channelMessages.values()).pop()

    if (!initialEmbed) throw new Error("No se ha podido obtener el embed inicial.")

    const newButton = new ButtonBuilder(Buttons.close.components[0].data).setDisabled(false)
    const newActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(newButton)

    await initialEmbed.edit({
      components: [newActionRow]
    })

  } catch (e) {
    console.log(`Ocurrió un error al intentar reactivar el botón de cerrar.\nERR: ${e}`)
  }

  const ActiveTicketData = await ActiveTicketsSchema.findOne({ channelId: channel.id })
  
  if (ActiveTicketData?.userId) {
    await channel.permissionOverwrites.edit(ActiveTicketData.userId, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
      AttachFiles: true,
    })
  }

  await channel.edit({ name: `${channel.name.replace("✅", "")}` })

  await interaction.message.delete()
    .catch((e) => console.log(`Ocurrió un error al intentar borrar el mensaje de confirmación de cierre de ticket. Probablemente dos usuarios intentaron reabrir el ticket a la vez.\nERR: ${e}}`))
}
