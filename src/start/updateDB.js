const ActiveTicketsSchema = require("../schemas/ActiveTicketsSchema")

module.exports = {
  eventName: "ready",
  async run(client) {
    const ActiveTicketsData = await ActiveTicketsSchema.find()
    ActiveTicketsData.forEach(async (ticketData) => {
      if (!client.channels.cache.get(ticketData.channelId)) await ticketData.deleteOne()
    })
  }
}