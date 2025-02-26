const { SlashCommandBuilder, MessageFlags } = require("discord.js")


const NAMES_OF_SUBCOMMANDS = {
  "cerrar": "close",
  "borrar": "delete",
  "renombrar": "rename",
  "añadir": "add",
  "quitar": "remove"
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Comandos para gestionar los tickets.")
    .setDMPermission(false)
    .addSubcommand(subcommand => subcommand
      .setName("cerrar")
      .setDescription("Cerrar un ticket (DEBE EJECUTARSE DESDE EL MISMO CANAL DEL TICKET).")
      .addStringOption(op => op
        .setName("ticket")
        .setDescription("Número de ticket que deseas cerrar.")
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName("borrar")
      .setDescription("Borrar un ticket (DEBE EJECUTARSE DESDE EL MISMO CANAL DEL TICKET).")
      .addStringOption(op => op
        .setName("ticket")
        .setDescription("Número de ticket que deseas borrar.")
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName("renombrar")
      .setDescription("Renombrar un ticket.")
      .addStringOption(op => op
        .setName("ticket")
        .setDescription("Nº del ticket que se deseas renombrar (DEBE EJECUTARSE DESDE EL MISMO CANAL DEL TICKET).")
        .setRequired(true)
      )
      .addStringOption((op => op
        .setName("valorañadido")
        .setDescription("Texto que se añade detrás del nombre del ticket.")
        .setRequired(true)
      )
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName("añadir")
      .setDescription("Añade al usuario o rol que quieras al ticket (DEBE EJECUTARSE DESDE EL MISMO CANAL DEL TICKET).")
      .addUserOption(op => op
        .setName("usuario")
        .setDescription("Usuario al que se quiere añadir al ticket")
        .setRequired(false)
      )
      .addRoleOption(op => op
        .setName("rol")
        .setDescription("Rol que se quiere añadir al ticket")
        .setRequired(false)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName("quitar")
      .setDescription("Quita al usuario o rol que quieras del ticket (DEBE EJECUTARSE DESDE EL MISMO CANAL DEL TICKET).")
      .addUserOption(op => op
        .setName("usuario")
        .setDescription("Usuario que se quiere quitar del ticket")
        .setRequired(false)
      )
      .addRoleOption(op => op
        .setName("rol")
        .setDescription("Rol que se quiere quitar del ticket")
        .setRequired(false)
      )
    ),

  async run(client, interaction) {
    const subcommand = interaction.options.getSubcommand()

    if (!NAMES_OF_SUBCOMMANDS[subcommand]) return interaction.reply({ content: "Ocurrió un error al intentar obtener el subcomando, contacte con un desarrollador del BOT.", flags: MessageFlags.Ephemeral })
    const subcommandFile = require(`./ticketSubcommands/${NAMES_OF_SUBCOMMANDS[subcommand]}`)
  
    if (subcommandFile.run) await subcommandFile.run(client, interaction)
    else interaction.reply({ content: "Ocurrió un error al intentar obtener el subcomando, contacte con un desarrollador del BOT.", flags: MessageFlags.Ephemeral })


  }
}