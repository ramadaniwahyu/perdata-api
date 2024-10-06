const Panggilan = require('../models/panggilanModel')
const fs = require('fs')
const path = require('path')


class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString } //queryString = req.query

        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete (queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        //    gte = greater than or equal
        //    lte = lesser than or equal
        //    lt = lesser than
        //    gt = greater than
        this.query.find(JSON.parse(queryStr))

        return this;
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const panggilanCtrl = {
    getData: async (req, res) => {
        try {
            const features = new APIfeatures(Panggilan.find().populate('jenis_panggilan').populate('hasil_panggilan'), req.query)
                .filtering().sorting().paginating()

            const data = await features.query
            res.json({
                status: 'success',
                count: data.length,
                result: data
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createData: async (req, res) => {
        try {
            // if user have role = 1 ---> admin
            // only admin can create , delete and update category
            const { jenis_perkara, nomor_perkara, pihak, alamat, jenis_panggilan, tgl_kirim, tgl_dilaksanakan, hasil_panggilan, desc, jurusita } = req.body;

            const newData = new Panggilan({
                jenis_perkara, nomor_perkara, pihak, alamat, jenis_panggilan, tgl_kirim, tgl_dilaksanakan, hasil_panggilan, desc, jurusita
            })

            await newData.save()

            res.json({ msg: "Created a data" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteData: async (req, res) => {
        try {
            await Panggilan.findByIdAndDelete(req.params.id)
            res.json({ msg: "Deleted a data" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateData: async (req, res) => {
        try {
            const { jenis_perkara, nomor_perkara, pihak, alamat, jenis_panggilan, tgl_kirim, tgl_dilaksanakan, hasil_panggilan, desc, jurusita } = req.body;

            const result = await Panggilan.findOneAndUpdate({ _id: req.params.id }, {
                jenis_perkara, nomor_perkara, pihak, alamat, jenis_panggilan, tgl_kirim, tgl_dilaksanakan, hasil_panggilan, desc, jurusita
            })

            res.json({ msg: "Data panggilan telah diupdate" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    upload: async (req, res) => {
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ msg: 'No files were uploaded.' })
            } else {
                const file = req.files.file;
                const string_arr = file.name.split('.')
                const ext_type = string_arr[string_arr.length - 1]

                if (file.mimetype !== 'application/pdf') {
                    removeTmp(file.tempFilePath)
                    return res.status(400).json({ msg: "File format is incorrect. Only PDF is permitted" })
                }

                const filename = req.params.id + '.' + ext_type

                const dir = 'panggilan/' + filename
                uploadPath = path.resolve(__dirname, '../uploads/', dir)
                await Panggilan.findOneAndUpdate({ _id: req.params.id }, {
                    edoc: dir
                })
                fs.unlink(uploadPath, err => { })
                file.mv(uploadPath, function (err) {
                    if (err)
                        return res.status(500).send(err);
                    res.send('File uploaded!');
                });
            }
        } catch (err) {
            return res.status(500).json({ msg: 'Internal Server Error' })
        }
    },
    destroy: async (req, res) => {
        try {
            const filename = req.params.id + '.pdf'
            uploadPath = path.resolve(__dirname, '../uploads/panggilan/', filename)
            await Panggilan.findOneAndUpdate({ _id: req.params.id }, {
                edoc: ''
            })
            fs.unlink(uploadPath, err => {
                if (err) throw res.status(500).json({ msg: err.code })
            })
            return res.status(200).json({ msg: 'Document is deleted.' })
        } catch (err) {
            res.status(500).json({ msg: 'Internal Server Error' })
        }
    }
}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

module.exports = panggilanCtrl