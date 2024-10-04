const mongoose = require('mongoose')

const hasilPanggilanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('HasilPanggilan', hasilPanggilanSchema)