const mongoose = require('mongoose')
const { Schema } = mongoose;

const panggilanSchema = new mongoose.Schema({
    jenis_perkara: {
        type: Schema.Types.ObjectId,
        ref: 'JenisPerkara'
    },
    nomor_perkara: {
        type: String,
        required: true,
        trim: true
    },
    pihak: {
        type: String,
        required: true
    },
    alamat: {
        type: String
    },
    jenis_panggilan: {
        type: Schema.Types.ObjectId,
        ref: 'JenisPanggilan'
    },
    tgl_kirim: {
        type: Date
    },
    nomor_kirim:{
        type: String
    },
    tgl_dilaksanakan: {
        type: Date
    },
    hasil_panggilan: {
        type: Schema.Types.ObjectId,
        ref: 'HasilPanggilan'
    },
    desc: {
        type: String
    },
    jurusita: {
        type: Schema.Types.ObjectId,
        ref: 'Jurusita'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Panggilan', panggilanSchema)