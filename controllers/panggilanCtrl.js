const Panggilan = require('../models/panggilanModel')

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
       const queryObj = {...this.queryString} //queryString = req.query

       const excludedFields = ['page', 'sort', 'limit']
       excludedFields.forEach(el => delete(queryObj[el]))
       
       let queryStr = JSON.stringify(queryObj)
       queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
       this.query.find(JSON.parse(queryStr))
         
       return this;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const panggilanCtrl = {
    getData: async(req, res) =>{
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
            return res.status(500).json({msg: err.message})
        }
    },
    createData: async (req, res) =>{
        try {
            // if user have role = 1 ---> admin
            // only admin can create , delete and update category
            const { jenis_perkara, nomor_perkara, pihak, alamat, jenis_panggilan, tgl_kirim, tgl_dilaksanakan, hasil_panggilan, desc, jurusita } = req.body;
            
            const newData = new Panggilan({
                jenis_perkara, nomor_perkara, pihak, alamat, jenis_panggilan, tgl_kirim: new Date(tgl_kirim), tgl_dilaksanakan: new Date(tgl_dilaksanakan), hasil_panggilan, desc, jurusita
            })

            await newData.save()

            res.json({msg: "Created a data"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteData: async(req, res) =>{
        try {
            await Panggilan.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a data"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateData: async(req, res) =>{
        try {
            const { jenis_perkara, nomor_perkara, pihak, alamat, jenis_panggilan, tgl_kirim, tgl_dilaksanakan, hasil_panggilan, desc, jurusita } = req.body;
            
            const result = await Panggilan.findOneAndUpdate({_id: req.params.id}, {
                jenis_perkara, nomor_perkara, pihak, alamat, jenis_panggilan, tgl_kirim: new Date(tgl_kirim), tgl_dilaksanakan: new Date(tgl_dilaksanakan), hasil_panggilan, desc, jurusita
            })
            
            res.json({msg: "Data panggilan telah diupdate"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}
module.exports = panggilanCtrl