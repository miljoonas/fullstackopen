const mongoose = require('mongoose')

mongoose.set('strictQuery',false)
const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

const validateNumber = (phoneNumber) => {
  const regex = /^\d{2,3}-\d+$/
  return regex.test(phoneNumber)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name needs to be at least 3 characters long'],
    required: true
  },
  number: {
    type: String,
    required: true,
    minLength: [8, 'Number too short'],
    validate: [validateNumber, 'Invalid number format']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)