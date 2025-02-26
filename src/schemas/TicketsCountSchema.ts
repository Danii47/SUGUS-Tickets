import { Schema, model } from "mongoose"

const TicketsCountSchema = new Schema({
  customId: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
})

export default model('TicketsCountSchema', TicketsCountSchema)