const { validationResult } = require('express-validator');

const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

const createUser = async (req, res) => {
    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation Errors',
                errors: errors.array()
            });
        }

        const { name, email } = req.body;

        const isExists = await User.findOne({
            email
        })

        if(isExists){
            return res.status(400).json({
                success: false,
                msg: 'Email is already exists!',
            });
        }

        const password = randomstring.generate(6);
        const hashPassword = await bcrypt.hash(password, 10)

        var obj = {
            name,
            email,
            password: hashPassword
        }

        if(req.body.role && req.body.role === 1){
            return res.status(400).json({
                success: false,
                msg: "You can't create Admin!",
            });
        }
        else if(req.body.role) {
            obj.role = req.body.role;
        }

        const user = User( obj );

        const userData = await user.save();

        console.log(password);
        
        return res.status(200).json({
            success: true,
            msg: "User Created Successfully!",
            data: userData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}


module.exports = {
    createUser,
}