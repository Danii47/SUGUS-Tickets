// ! "discord.js": "14.18.0"

import { Client, IntentsBitField, Events, Collection, ButtonInteraction, StringSelectMenuInteraction } from "discord.js"
import mongoose from "mongoose"
import fs from "node:fs"
import path from "node:path"
import moment from "moment"
import { slashCommandsFolderName } from "./configs/generalConfig.json"
import "dotenv/config"
import { ButtonHandlerFunction, MyClient } from "./types/CustomTypes"

const client = new Client({
  intents: new IntentsBitField(3276799)
}) as MyClient

moment.locale("es")

if (!process.env.SECRET_TOKEN) throw new Error("No se ha encontrado el token del bot en el archivo .env")
if (!process.env.MONGOOSE_CONNECT) throw new Error("No se ha encontrado la conexion a la base de datos en el archivo .env")

// ! -.- MONGODB CONNECTION -.- ! \\

mongoose.connect(process.env.MONGOOSE_CONNECT)
  .then(() => console.log("\n[MONGO-DB] Conectado a DB ☁️"))
  .catch((error: Error) => console.log("\n[MONGO-DB] Ocurrio un error al intentar conectar la DB:\n", error));


// ! -.- START FILES HANDLER -.- ! \\

const startPath = path.resolve(__dirname, "start")
const startFiles = fs.readdirSync(startPath)
for (const startFile of startFiles) {
  const startFileData = require(path.resolve(startPath, startFile))
  client.on(startFileData.eventName, (...args) => startFileData.run(client, ...args))
}


// ! -.- BUTTONS HANDLER -.- ! \\

const buttonsHandlerPath = path.resolve(__dirname, "src", "buttonsHandler")
const buttonsHandlerFiles = fs.readdirSync(buttonsHandlerPath).filter(file => file.endsWith(".js") || file.endsWith(".ts"))

for (const buttonsHandlerFile of buttonsHandlerFiles) {
  const buttonsHandlerPath = path.resolve(__dirname, "buttonsHandler", buttonsHandlerFile)
  const { buttonHandlerFunction }: { buttonHandlerFunction: ButtonHandlerFunction } = require(buttonsHandlerPath)

  client.on(Events.InteractionCreate, (interaction) => {
    if (interaction.isStringSelectMenu() || interaction.isButton()) {
      buttonHandlerFunction(client, interaction as ButtonInteraction | StringSelectMenuInteraction)
    }
  })
}


// ! -.- SLASHCOMMAND HANDLER -.- ! \\

client.slashCommands = new Collection()
client.commands = []

const slashCommandPath = path.resolve(__dirname, slashCommandsFolderName)
const slashCommandFiles = fs.readdirSync(slashCommandPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"))

for (const slashCommandFile of slashCommandFiles) {
  const slashCommandPath = path.resolve(__dirname, slashCommandsFolderName, slashCommandFile)
  //const { default: slashCommand } = await 
  import(`file://${slashCommandPath}`)
    .then(({ default: slashCommand }) => {
      client.slashCommands.set(slashCommand.data.name, slashCommand)
      client.commands.push(slashCommand.data.toJSON())
      console.log(`[SLASHCOMMAND] ✅🔔 Comando cargado -> ${slashCommandFile}`)
    })
    .catch((error) => console.log(`[SLASHCOMMAND] ❌🔔 Ocurrio un error al intentar cargar el comando ${slashCommandFile}:\n`, error))
}


// ! -.- BOT LOGIN -.- ! \\

client.login(process.env.SECRET_TOKEN)