require('dotenv').config()
const { Routes } = require("discord.js")
const { REST } = require('@discordjs/rest')
const rest = new REST({ version: '10' }).setToken(process.env.SECRET_TOKEN)

const createSlash = async (client) => {
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id), { body: client.commands }
    )
    console.log('\x1b[35m', `\n[SLASH-COMMANDS] ✅ Añadidos / Actualizados con exito.`, '\x1b[0m')
  } catch (e) {
    console.log('\x1b[31m', `\n[SLASH-COMMANDS] ❌ Error al añadir SlashCommands.\n\nERR: ${e}\n\n`, '\x1b[0m')
  }
}

module.exports = createSlash
