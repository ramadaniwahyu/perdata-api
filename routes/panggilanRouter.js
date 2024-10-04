const router = require('express').Router()
const panggilanCtrl = require('../controllers/panggilanCtrl')
const auth = require('../middleware/auth')


router.route('/panggilan')
    .get(auth, panggilanCtrl.getData)
    .post(auth, panggilanCtrl.createData)

router.route('/panggilan/:id')
    .delete(auth, panggilanCtrl.deleteData)
    .put(auth, panggilanCtrl.updateData)


module.exports = router