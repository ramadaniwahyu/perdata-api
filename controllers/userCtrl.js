const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {
    getUser: async (req, res) => {
        try {
            const users = await User.find().select('-password')

            res.json({
                status: 'success',
                count: users.length,
                result: users
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    addUser: async (req, res) => {
        try {
            const { name, email, password } = req.body
            const user = await User.findOne({ email })
            if (user) return res.status(400).json({ msg: 'Email is exist.' })

            if (password.length < 6) return res.status(400).json({ msg: "Password's length is minimal 6 characters." })

            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new User({
                name, email, password: passwordHash
            })
            await newUser.save()

            res.json({ msg: "User is added. Please login." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getOneUser: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.id }).select('-password')
            if (!user) return res.status(400).json({ msg: "User is not exist." })

            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUser: async (req, res) => {
        try {
            const { name, email, password, role, is_active } = req.body;

            if (password && password.length < 6)
                return res.status(400).json({ msg: "Password's length is minimal 6 characters." })

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)

            await User.findOneAndUpdate({ _id: req.params.id }, {
                name, email, password: passwordHash, role, is_active
            }, { new: true })

            res.json({ msg: "User has been updated." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    activateUser: async(req, res) => {
        try {
            const { is_active } = req.body
            console.log(req.body);
            
            await User.findOneAndUpdate({ _id: req.params.id },{
                is_active
            }, {new: true})
            
            if (is_active) { res.json({msg: "User is activated"})} 
            else { res.json({msg: "User is deactivated"}) }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.json({ msg: "User has been deleted." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email })
            if (!user) return res.status(400).json({ msg: "User is not exist" })

            if (!user.is_active) return res.status(403).json({ msg: "User is inactive" })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Password is wrong." })

            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accesstoken: accesstoken
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' })
            return res.json({ msg: "Keluar" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please login." })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login." })

                const accesstoken = createAccessToken({ id: user.id })

                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    is_admin: user.is_admin,
                    accesstoken: accesstoken
                })
            })
            // res.json({rf_token})
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserInfo: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password -is_admin -is_active')
            if (!user) return res.status(400).json({ msg: "User is not exist." })

            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUserInfo: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (password.length < 6)
                return res.status(400).json({ msg: "Password's length is minimal 6 characters." })

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)

            await User.findByIdAndUpdate({ _id: req.user.id }, {
                name, email, password: passwordHash
            }) 
            
            res.json({msg: "Profil updated."})
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}


const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl