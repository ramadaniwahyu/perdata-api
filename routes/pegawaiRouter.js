const router = require('express').Router()
const pegawaiCtrl = require('../controllers/pegawaiCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/pegawai')
    .get(auth, pegawaiCtrl.getData)
    .post(auth, authAdmin, pegawaiCtrl.createData)

router.route('/pegawai/:id')
    .delete(auth, authAdmin, pegawaiCtrl.deleteData)
    .put(auth, authAdmin, pegawaiCtrl.updateData)


module.exports = router