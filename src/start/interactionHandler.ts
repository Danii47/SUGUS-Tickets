import { ApplicationCommandOptionType, ChatInputCommandInteraction, TextChannel } from "discord.js"
import { MyClient } from "../types/CustomTypes"
import { EmbedBuilder, MessageFlags, Events } from "discord.js"
import moment from 'moment'
import generalConfig from "../configs/generalConfig.json"

const { channels: { logCommands, crashBot }, dev, serverName } = generalConfig

module.exports = {
  eventName: Events.InteractionCreate,
  async run(client: MyClient, interaction: ChatInputCommandInteraction) {

    if (!interaction.isCommand()) return

    const slashCommands = client.slashCommands.get(interaction.commandName)
    if (!slashCommands) return

    try {
      await slashCommands.run(client, interaction)
      const date = `${moment(Date.now()).format('l')} ${moment(Date.now()).format('LTS')}`

      const logCommandChannel = client.channels.cache.get(logCommands) as TextChannel

      const interactionOptions = interaction.options.data.map((option) => {
        let valueToReturn: any = option.value

        if (option.type === ApplicationCommandOptionType.User) valueToReturn = option.user
        else if (option.type === ApplicationCommandOptionType.Channel) valueToReturn = option.channel
        else if (option.type === ApplicationCommandOptionType.Role) valueToReturn = option.role
        else if (option.type === ApplicationCommandOptionType.Attachment) {

        }
        
        return {
          name: `${option.name[0].toUpperCase()}${option.name.slice(1)}:`,
          value: `${valueToReturn}`
        }
      })

      const subCommand = interaction.options.getSubcommand()

      if (logCommandChannel) logCommandChannel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() || undefined })
            .setTitle(`Ha ejecutado un comando`)
            .addFields(
              { name: "Usuario:", value: `${interaction.user}`, inline: true },
              { name: "Discord ID:", value: `${interaction.user.id}`, inline: true },
              { name: "Comando ejecutado:", value: `/${interaction.commandName}${(subCommand) ? ` ${subCommand}` : ""}` },
              ...interactionOptions,
              { name: "Fecha:", value: `<t:${Math.floor((Date.now()) / 1000)}>` }
            )
            .setThumbnail(interaction.guild?.iconURL() || null)
            .setColor("Blue")
            .setFooter({ text: `${serverName} | Sistema de logs`, iconURL: interaction.guild?.iconURL() || undefined })
            .setTimestamp()
        ]
      })

      console.log(`\n[${(interaction.guild) ? interaction.guild.name : interaction.user.username.toUpperCase}] Se ha usado el slash command /${interaction.commandName}${(subCommand) ? ` ${subCommand}` : ""} por ${interaction.user.tag} a las [${date}]`)
    } catch (e) {

      console.error(`Ocurrio un error con el comando ${interaction.commandName}\nERR: ${e}\n`)
      await interaction.reply({ content: 'Ocurrió un error al intentar usar el comanando. Notificalo a algún administrador.', flags: MessageFlags.Ephemeral })

      const errChannel = client.channels.cache.get(crashBot) as TextChannel

      if (errChannel) errChannel.send({
        content: `||${dev}||`,
        embeds: [
          new EmbedBuilder()
            .setTitle("⚠️ Nuevo error")
            .setColor("Red")
            .setDescription(`Ocurrio un error con el comando ${interaction.commandName}\n\n**ERROR:**\n${e}`)
            .setTimestamp()
            .setFooter({ text: `${serverName} | Sistema anticrash`, iconURL: interaction.guild?.iconURL() || undefined })
        ]
      })
    }
  }
}