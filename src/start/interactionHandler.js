const { EmbedBuilder, MessageFlags } = require("discord.js")
const moment = require('moment')
const { channels: { logCommands, crashBot }, dev, serverName } = require("../configs/generalConfig.json")

module.exports = {
  eventName: "interactionCreate",
  async run(client, interaction) {

    if (!interaction.isCommand()) return

    const slashCommands = client.slashCommands.get(interaction.commandName)
    if (!slashCommands) return

    try {
      await slashCommands.run(client, interaction)
      const date = `${moment(Date.now()).format('l')} ${moment(Date.now()).format('LTS')}`

      const logCommandChannel = client.channels.cache.get(logCommands)

      const interactionOptions = interaction.options._hoistedOptions.map((option) => {

        let valueToReturn = option.value
        if (option.type === 6) valueToReturn = option.user // userOption
        else if (option.type === 7) valueToReturn = option.channel // channelOption
        else if (option.type === 8) valueToReturn = option.role // roleOption
        else if (option.type === 11) { // attachmentOption

        }
        
        return {
          name: `${option.name[0].toUpperCase()}${option.name.slice(1)}:`,
          value: `${valueToReturn}`
        }
      })

      const subCommand = interaction.options._subcommand

      if (logCommandChannel) logCommandChannel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setTitle(`Ha ejecutado un comando`)
            .addFields(
              { name: "Usuario:", value: `${interaction.user}`, inline: true },
              { name: "Discord ID:", value: `${interaction.user.id}`, inline: true },
              { name: "Comando ejecutado:", value: `/${interaction.commandName}${(subCommand) ? ` ${subCommand}` : ""}` },
              ...interactionOptions,
              { name: "Fecha:", value: `<t:${Math.floor((Date.now()) / 1000)}>` }
            )
            .setThumbnail(interaction.guild.iconURL())
            .setColor("Blue")
            .setFooter({ text: `${serverName} | Sistema de logs`, iconURL: interaction.guild.iconURL() })
        ]
      })

      console.log(`\n[${interaction.guild.name}] Se ha usado el slash command /${interaction.commandName}${(subCommand) ? ` ${subCommand}` : ""} por ${interaction.user.tag} a las [${date}]`)
    } catch (e) {

      console.error(`Ocurrio un error con el comando ${interaction.commandName}\nERR: ${e}\n`)
      await interaction.reply({ content: 'Ocurrió un error al intentar usar el comanando. Notificalo a algún administrador.', flags: MessageFlags.Ephemeral })

      const errChannel = client.channels.cache.get(crashBot)

      if (errChannel) errChannel.send({
        content: `||${dev}||`,
        embeds: [
          new EmbedBuilder()
            .setTitle("⚠️ Nuevo error")
            .setColor("Red")
            .setDescription(`Ocurrio un error con el comando ${interaction.commandName}\n\n**ERROR:**\n${e}`)
            .setTimestamp()
            .setFooter({ text: `${serverName} | Sistema anticrash`, iconURL: interaction.guild.iconURL() })
        ]
      })
    }
  }
}