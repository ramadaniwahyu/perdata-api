const router = require('express').Router()
const auth = require('../middleware/auth')
const path = require('path')


router.get("/*", auth, async (req, res) => {
    const downloadPath = path.resolve(__dirname, '../uploads/', req.params[0])
    res.sendFile(downloadPath, err => {
        if (err) {
            if (err.code == 'ENOENT') {
                res.status(404).send({ msg: 'File not found!' })
            }
            else {
                res.status(500).send({ msg: err.message })
            }
        }
    })
})

module.exports = router;