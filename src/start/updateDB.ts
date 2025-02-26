import { Events } from "discord.js"
import ActiveTicketsSchema from "../schemas/ActiveTicketsSchema"
import { MyClient } from "../types/CustomTypes"

export const eventName = Events.ClientReady
export async function run(client: MyClient) {
  const ActiveTicketsData = await ActiveTicketsSchema.find()
  
  ActiveTicketsData.forEach(async (ticketData) => {
    if (!client.channels.cache.get(ticketData.channelId)) await ticketData.deleteOne()
  })
}