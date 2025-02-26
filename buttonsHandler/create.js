const getTicketCustomIds = require("../utils/getTicketsCustomId")
const getTicketByCustomId = require("../utils/getTicketByCustomId")
const zeroFill = require("../utils/zeroFill")
const { dev, serverName, defaultColor } = require("../configs/generalConfig.json")
const { ChannelType, EmbedBuilder, MessageFlags } = require("discord.js")
const Buttons = require("../constants/buttons")
const TicketsCountSchema = require("../schemas/TicketsCountSchema")
const ActiveTicketsSchema = require("../schemas/ActiveTicketsSchema")

module.exports = {
  async buttonHandlerFunction(_, interaction) {

    if (!interaction.isStringSelectMenu()) return

    const createTicketsCustomIds = getTicketCustomIds()
    if (!createTicketsCustomIds.includes(interaction.values[0])) return

    const ticketInfo = getTicketByCustomId(interaction.values[0])
    if (!ticketInfo) return interaction.reply({ content: `No ha sido posible crear el ticket. No existe el ID personalizado del botón. Informa de este error a ${dev}` })
    
    let ticketData = await TicketsCountSchema.findOne({ customId: ticketInfo.customId })
    if (!ticketData) {
      const newTicketData = new TicketsCountSchema({
        customId: ticketInfo.customId,
        count: 0
      })
      await newTicketData.save()
    } else {
      await ticketData.updateOne({ count: ticketData.count + 1 })
    }
    const ticketCount = (!ticketData) ? 0 : ticketData.count + 1

    console.log(`[TICKETS] El usuario ${interaction.user.username} ha creado un ticket de ${ticketInfo.name}.`)
  
    const ticketParent = interaction.guild.channels.cache.find(parent => parent.id == ticketInfo.categoryId && parent.type == ChannelType.GuildCategory)
    const ticketParentId = (!ticketParent || ticketParent?.children.cache.size >= 45) ? undefined : ticketInfo.categoryId

    const openPermissionOverwrites = [...ticketInfo.permissions.filter((permission) => interaction.guild.roles.cache.get(permission.id))]
    openPermissionOverwrites.push({ id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles'] })

    interaction.guild.channels.create({
      name: `${ticketInfo.name}-${zeroFill(ticketCount, 4)}`,
      type: ChannelType.GuildText,
      parent: ticketParentId,
      permissionOverwrites: openPermissionOverwrites
    })
      .catch((err) => console.log(`No fue posible crear el ticket de ${ticketInfo.name}. \nERROR: ${err}`))
      .then(async (ticketChannel) => {
        let mentions
        if (ticketInfo.mentions) {
          mentions = ticketInfo.mentions.map((roleId) => {
            if (interaction.guild.roles.cache.get(roleId)) return `<@&${roleId}>`
          })
        }

        await ticketChannel.send({
          content: `Bienvenido/a ${interaction.user} al sistema de ayuda de ${serverName}. \nEsperamos poder atenderte con la mayor brevedad posible.\n${(mentions) ? `||${mentions.join("")}||` : ""}`,
          components: [Buttons.close],
          embeds: [
            new EmbedBuilder()
            .setColor(ticketInfo.embedColor || defaultColor)
            .setTitle(ticketInfo.embedTitle() || defaultTitle)
            .setDescription(ticketInfo.embedDescription || defaultDescription)
              .setFooter({ text: `${serverName || "Servidor"}`, iconURL: interaction.guild.iconURL() })
              .setTimestamp()
          ],
          files: ticketInfo.embedFiles || []
        })
        
        const newActiveTicketsData = new ActiveTicketsSchema({
          channelId: ticketChannel.id,
          userId: interaction.user.id,
          ticketInfo
        })

        await newActiveTicketsData.save()

        await interaction.reply({ content: `Se ha creado un ticket de ${ticketInfo.name}. Tu ticket es ${ticketChannel}.`, flags: MessageFlags.Ephemeral })
        await interaction.message.edit({
          components: interaction.message.components
        })
      })
  }
}
