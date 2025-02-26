const createSlash = require("../utils/createSlash")

module.exports = {
  eventName: "ready",
  run(client) {
    createSlash(client)
    console.log(`[BOT] Bot iniciado con éxito. [${client.user.tag}]`)
  }
}