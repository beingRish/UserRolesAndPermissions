const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Permission = require('../models/permissionModel');
const UserPermission = require('../models/userPermissionModel')

const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation Errors',
                errors: errors.array()
            });
        }

        const { name, email, password } = req.body;
        isExistUser = await User.findOne({ email });

        if (isExistUser) {
            return res.status(409).json({
                success: false,
                msg: 'Email already exists!',
            });
        }
        hashedPassowrd = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassowrd
        });

        const userData = await user.save();

        // assign default permissions
        const defaultPermissions = await Permission.find({
            is_default: 1
        })

        if(defaultPermissions.length > 0) {

            const permissionArray = [];
            defaultPermissions.forEach(permission => {
                permissionArray.push({
                    permission_name: permission.permission_name,
                    permission_value: [0,1,2,3]
                });
            });

            const userPermission = new UserPermission({
                user_id: userData._id,
                permissions: permissionArray
            })

            await userPermission.save()

        }

        return res.status(201).json({
            success: true,
            msg: 'Registered Successfully!',
            data: userData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        });
    }
}

const generateAccessToken = async (user) => {
    const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: "2h" });
    return token;
}

const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation Errors',
                errors: errors.array()
            });
        }
        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(401).json({
                success: false,
                msg: 'Email & Password is incorrect!'
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, userData.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                msg: 'Email & password is incorrect!'
            });
        }
        const accessToken = await generateAccessToken({ user: userData });
        return res.status(200).json({
            success: true,
            msg: 'Login Successfully!',
            accessToken: accessToken,
            tokenType: 'Bearer',
            data: userData
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

const getProfile = async (req, res) => {
    try {
        const user_id = req.user._id;
        const userData = await User.findOne({ _id: user_id });

        return res.status(200).json({
            success: true,
            msg: 'Profile Data',
            data: userData
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getProfile
}