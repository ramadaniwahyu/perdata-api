const mongoose = require('mongoose')

const jenisPanggilanSchema = new mongoose.Schema({
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

module.exports = mongoose.model('JenisPanggilan', jenisPanggilanSchema)