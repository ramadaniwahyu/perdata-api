const Jurusita = require('../models/jurusitaModel')

const jurusitaCtrl = {
    getData: async(req, res) =>{
        try {
            const data = await Jurusita.find()
            res.json(data)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createData: async (req, res) =>{
        try {
            // if user have role = 1 ---> admin
            // only admin can create , delete and update category
            const {name, nip, phone, email, desc} = req.body;
            const data = await Jurusita.findOne({nip})
            if(data) return res.status(400).json({msg: "This data already exists."})

            const newData = new Jurusita({
                name, nip, phone, email, desc
            })

            await newData.save()
            res.json({msg: "Created a data"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteData: async(req, res) =>{
        try {
            await Jurusita.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a data"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateData: async(req, res) =>{
        try {
            const {name, nip, phone, email, desc} = req.body;
            await Jurusita.findOneAndUpdate({_id: req.params.id}, {
                name, nip, phone, email, desc
            })

            res.json({msg: "Updated a data"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}


module.exports = jurusitaCtrl