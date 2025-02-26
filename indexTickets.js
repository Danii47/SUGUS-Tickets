// ! "discord.js": "14.18.0"

const { Client, IntentsBitField, Events, Collection } = require('discord.js')
const Intents = new IntentsBitField(3276799)
const client = new Client({ intents: Intents })

const fs = require('fs')
const moment = require('moment')
moment.locale('es')
require('dotenv').config()
const mongoose = require('mongoose')
const { slashCommandsFolderName } = require("./configs/generalConfig.json")


// ! -.- MONGODB CONNECTION -.- ! \\

mongoose.connect(`${process.env.MONGOOSE_CONNECT}`)
  .then(() => console.log('\n[MONGO-DB] Conectado a DB ☁️'))
  .catch((error) => console.log('\n[MONGO-DB] Ocurrio un error al intentar conectar la DB:\n', error))


// ! -.- START FILES HANDLER -.- ! \\

const startFiles = fs.readdirSync("./start")
for (const startFile of startFiles) {
  const startFileData = require(`./start/${startFile}`)
  client.on(startFileData.eventName, (...args) => startFileData.run(client, ...args))
}


// ! -.- BUTTONS HANDLER -.- ! \\

const buttonsHandlerFolder = fs.readdirSync("./buttonsHandler")
for (const buttonsHandlerFiles of buttonsHandlerFolder) {

  const { buttonHandlerFunction } = require(`./buttonsHandler/${buttonsHandlerFiles}`)
  // client.on(Events.InteractionCreate, (interaction) => { if (interaction.isButton()) buttonHandlerFunction(client, interaction) })
  client.on(Events.InteractionCreate, (interaction) => { if (interaction.isStringSelectMenu() || interaction.isButton()) buttonHandlerFunction(client, interaction) })

}


// ! -.- SLASHCOMMAND HANDLER -.- ! \\

client.slashCommands = new Collection()
client.commands = []

const slashCommandFiles = fs.readdirSync(`./${slashCommandsFolderName}`).filter(file => file.endsWith('.js'))

for (const slashCommandFile of slashCommandFiles) {
  const slashCommand = require(`./${slashCommandsFolderName}/${slashCommandFile}`)
  client.slashCommands.set(slashCommand.data.name, slashCommand)
  client.commands.push(slashCommand.data.toJSON())
  console.log(`[SLASHCOMMAND] ✅🔔 Comando cargado -> ${slashCommandFile}`)
}


// ! -.- BOT LOGIN -.- ! \\

client.login(process.env.SECRET_TOKEN)