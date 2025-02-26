const { Schema, model } = require("mongoose")

const ActiveTicketsSchema = new Schema({
  channelId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    require: true
  },
  ticketInfo: {
    type: Object,
    required: true
  }
})

module.exports = model('ActiveTicketsSchema', ActiveTicketsSchema)