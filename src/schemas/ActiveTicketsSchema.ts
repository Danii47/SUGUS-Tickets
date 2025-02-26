import { Schema, model } from "mongoose"

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

export default model('ActiveTicketsSchema', ActiveTicketsSchema)