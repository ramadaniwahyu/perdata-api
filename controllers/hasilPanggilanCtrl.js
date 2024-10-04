const HasilPanggilan = require('../models/hasilPanggilanModel')

const hasilPanggilanCtrl = {
    getData: async(req, res) =>{
        try {
            const data = await HasilPanggilan.find()
            res.json(data)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createData: async (req, res) =>{
        try {
            // if user have role = 1 ---> admin
            // only admin can create , delete and update category
            const {name, desc} = req.body;
            const data = await HasilPanggilan.findOne({name})
            if(data) return res.status(400).json({msg: "This data already exists."})

            const newData = new HasilPanggilan({name, desc})

            await newData.save()
            res.json({msg: "Created a data"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteData: async(req, res) =>{
        try {
            await HasilPanggilan.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a data"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateData: async(req, res) =>{
        try {
            const {name, desc} = req.body;
            await HasilPanggilan.findOneAndUpdate({_id: req.params.id}, {name, desc})

            res.json({msg: "Updated a data"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}


module.exports = hasilPanggilanCtrl