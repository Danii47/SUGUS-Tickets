import "dotenv/config"
import { Routes } from 'discord.js'
import { REST } from '@discordjs/rest'
import { MyClient } from '../types/CustomTypes'

if (!process.env.SECRET_TOKEN) throw new Error("No se ha encontrado el token del bot en el archivo .env")

const rest = new REST({ version: '10' }).setToken(process.env.SECRET_TOKEN)

export const createSlash = async (client: MyClient): Promise<void> => {
  try {
    if (!client.user)
      throw new Error("No se ha encontrado el usuario del bot.")

    await rest.put(
      Routes.applicationCommands(client.user.id), { body: client.commands }
    )
    console.log('\x1b[35m', `\n[SLASH-COMMANDS] ✅ Añadidos / Actualizados con exito.`, '\x1b[0m')
  } catch (e) {
    console.log('\x1b[31m', `\n[SLASH-COMMANDS] ❌ Error al añadir SlashCommands.\n\nERR: ${e}\n\n`, '\x1b[0m')
  }
}
