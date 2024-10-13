const router = require('express').Router()
const jabatanCtrl = require('../controllers/jabatanCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/jabatan')
    .get(auth, jabatanCtrl.getData)
    .post(auth, authAdmin, jabatanCtrl.createData)

router.route('/jabatan/:id')
    .delete(auth, authAdmin, jabatanCtrl.deleteData)
    .put(auth, authAdmin, jabatanCtrl.updateData)


module.exports = router