const mongoose = require('mongoose')
const { Schema } = mongoose;

const JurusitaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    nip:{
        type: String
    },
    phone:{
        type: String
    },
    email:{
        type: String
    },
    desc:{
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Jurusita', JurusitaSchema)