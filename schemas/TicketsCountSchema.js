const { Schema, model } = require("mongoose")

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

module.exports = model('TicketsCountSchema', TicketsCountSchema)