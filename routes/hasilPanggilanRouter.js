const router = require('express').Router()
const hasilPanggilanCtrl = require('../controllers/hasilPanggilanCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/hasil-panggilan')
    .get(auth, hasilPanggilanCtrl.getData)
    .post(auth, authAdmin, hasilPanggilanCtrl.createData)

router.route('/hasil-panggilan/:id')
    .delete(auth, authAdmin, hasilPanggilanCtrl.deleteData)
    .put(auth, authAdmin, hasilPanggilanCtrl.updateData)


module.exports = router