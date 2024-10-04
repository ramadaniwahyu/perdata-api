const router = require('express').Router()
const jenisPerkaraCtrl = require('../controllers/jenisPerkaraCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/jenis-perkara')
    .get(auth, jenisPerkaraCtrl.getData)
    .post(auth, authAdmin, jenisPerkaraCtrl.createData)

router.route('/jenis-perkara/:id')
    .delete(auth, authAdmin, jenisPerkaraCtrl.deleteData)
    .put(auth, authAdmin, jenisPerkaraCtrl.updateData)


module.exports = router