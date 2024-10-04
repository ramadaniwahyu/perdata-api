const router = require('express').Router()
const jenisPanggilanCtrl = require('../controllers/jenisPanggilanCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/jenis-panggilan')
    .get(auth, jenisPanggilanCtrl.getData)
    .post(auth, authAdmin, jenisPanggilanCtrl.createData)

router.route('/jenis-panggilan/:id')
    .delete(auth, authAdmin, jenisPanggilanCtrl.deleteData)
    .put(auth, authAdmin, jenisPanggilanCtrl.updateData)


module.exports = router