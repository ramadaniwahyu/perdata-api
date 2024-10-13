const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pegawai: {
        type: Schema.Types.ObjectId,
        ref: 'Pegawai'
    },
    role: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)