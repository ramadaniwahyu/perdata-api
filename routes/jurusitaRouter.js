const router = require('express').Router()
const jurusitaCtrl = require('../controllers/jurusitaCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/jurusita')
    .get(auth, jurusitaCtrl.getData)
    .post(auth, authAdmin, jurusitaCtrl.createData)

router.route('/jurusita/:id')
    .delete(auth, authAdmin, jurusitaCtrl.deleteData)
    .put(auth, authAdmin, jurusitaCtrl.updateData)


module.exports = router