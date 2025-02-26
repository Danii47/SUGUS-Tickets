// ! "discord.js": "14.18.0"

import { Client, IntentsBitField, Events, Collection, ButtonInteraction, StringSelectMenuInteraction } from "discord.js"
import mongoose from "mongoose"
import fs from "fs"
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

const startFiles = fs.readdirSync("./src/start")
for (const startFile of startFiles) {
  const startFileData = require(`./start/${startFile}`)
  client.on(startFileData.eventName, (...args) => startFileData.run(client, ...args))
}


// ! -.- BUTTONS HANDLER -.- ! \\

const buttonsHandlerFolder = fs.readdirSync("./src/buttonsHandler")
for (const buttonsHandlerFiles of buttonsHandlerFolder) {
  const { buttonHandlerFunction }: { buttonHandlerFunction: ButtonHandlerFunction } = require(`./buttonsHandler/${buttonsHandlerFiles}`)

  client.on(Events.InteractionCreate, (interaction) => {
    if (interaction.isStringSelectMenu() || interaction.isButton()) {
      buttonHandlerFunction(client, interaction as ButtonInteraction | StringSelectMenuInteraction)
    }
  })
}


// ! -.- SLASHCOMMAND HANDLER -.- ! \\

client.slashCommands = new Collection()
client.commands = []

const slashCommandFiles = fs.readdirSync(`./src/${slashCommandsFolderName}`).filter(file => file.endsWith(".ts"))

for (const slashCommandFile of slashCommandFiles) {
  const { default: slashCommand } = require(`./${slashCommandsFolderName}/${slashCommandFile}`)
  
  client.slashCommands.set(slashCommand.data.name, slashCommand)
  client.commands.push(slashCommand.data.toJSON())
  console.log(`[SLASHCOMMAND] ✅🔔 Comando cargado -> ${slashCommandFile}`)
}


// ! -.- BOT LOGIN -.- ! \\

client.login(process.env.SECRET_TOKEN)