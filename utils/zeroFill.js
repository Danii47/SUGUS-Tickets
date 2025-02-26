const zeroFill = (number, width) => {
  const numberOutput = Math.abs(number)
  const length = number.toString().length
  const zero = "0"

  if (width <= length) {
    if (number < 0) {
      return ("-" + numberOutput.toString())
    } else {
      return numberOutput.toString()
    }
  } else {
    if (number < 0) {
      return ("-" + (zero.repeat(width - length)) + numberOutput.toString())
    } else {
      return ((zero.repeat(width - length)) + numberOutput.toString())
    }
  }
}

module.exports = zeroFill
