import { Events } from "discord.js"
import { createSlash } from "../utils/createSlash"
import { MyClient } from "../types/CustomTypes"

export const eventName = Events.ClientReady
export function run(client: MyClient) {
  if (!client.user) throw new Error("No se ha encontrado el usuario del bot.")

  createSlash(client)
  console.log(`[BOT] Bot iniciado con éxito. [${client.user.tag}]`)
}