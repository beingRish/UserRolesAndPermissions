const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const Permission = require('../models/permissionModel');
const UserPermission = require('../models/userPermissionModel');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const { sendMail } = require('../helpers/mailer');
const mongoose = require('mongoose');

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

        if (isExists) {
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

        if (req.body.role && req.body.role === 1) {
            return res.status(400).json({
                success: false,
                msg: "You can't create Admin!",
            });
        }
        else if (req.body.role) {
            obj.role = req.body.role;
        }

        const user = User(obj);
        const userData = await user.save();

        // add permission to user if coming in request
        if(req.body.permissions != undefined && req.body.permissions.length > 0) {

            const addPermission = req.body.permissions

            const permissionArray = [];

            await Promise.all(addPermission.map( async(permission) => {

                const permissionData = await Permission.findOne({ _id: permission.id });

                permissionArray.push({
                    permission_name: permissionData.permission_name,
                    permission_value: permission.value
                });
            } ));

            const userPermission = new UserPermission({
                user_id: userData._id,
                permissions: permissionArray
            })

            await userPermission.save();

        }

        console.log(password);

        const content = `
            <p>
                Hii <b>`+ userData.name + `,</b> 
                Your Account is created, below is your details.
            </p>
            <table style="border-style:none:">
                <tr>
                    <th>
                        Name: -
                    </th>
                    <td>
                        `+ userData.name + `
                    </td>
                </tr>
                
                <tr>
                    <th>
                        Email: -
                    </th>
                    <td>
                        `+ userData.email + `
                    </td>
                </tr>
                
                <tr>
                    <th>
                        Password: -
                    </th>
                    <td>
                        `+ userData.password + `
                    </td>
                </tr>
            </table>
            <p>Now you can login your account in Our Application, Thanks...</p>
        `

        sendMail(userData.email, 'Account Created', content)

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

const getUsers = async (req, res) => {
    try {

        const users = await User.aggregate([
            {
                $match: {
                    _id: {
                        $ne: new mongoose.Types.ObjectId(req.user._id)
                    }
                }
            },
            {
                $lookup: {
                    from: "userpermissions",
                    localField: "_id",
                    foreignField: "user_id",
                    as: 'permissions'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    role: 1,
                    permissions: {
                        $cond: {
                            if: { $isArray: "$permissions" },
                            then: { $arrayElemAt: ["$permissions", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $addFields: {
                    "permissions": {
                        "permissions": "$permissions.permissions"
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            msg: 'Users Fetched Successfully!',
            data: users
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

const updateUser = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation Errors',
                errors: errors.array()
            });
        }

        const { id, name } = req.body;

        const isExists = await User.findOne({
            _id: id
        })

        if (!isExists) {
            return res.status(400).json({
                success: false,
                msg: 'User not exists!'
            })
        }

        var updateObj = {
            name
        }

        if (req.body.role != undefined) {
            updateObj.role = req.body.role;
        }

        const updatedData = await User.findByIdAndUpdate({ _id: id }, {
            $set: updateObj
        }, { new: true });

        

        // update permission to user if coming in request
        if(req.body.permissions != undefined && req.body.permissions.length > 0) {

            const updatePermission = req.body.permissions

            const permissionArray = [];

            await Promise.all(updatePermission.map( async(permission) => {

                const permissionData = await Permission.findOne({ _id: permission.id });

                permissionArray.push({
                    permission_name: permissionData.permission_name,
                    permission_value: permission.value
                });
            } ));

            await UserPermission.findOneAndUpdate(
                { user_id: updatedData._id },
                { permissions: permissionArray },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        return res.status(200).json({
            success: true,
            msg: 'User Updated Successfully!',
            data: updatedData
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation Errors',
                errors: errors.array()
            });
        }

        const { id } = req.body;

        const isExists = await User.findOne({
            _id: id
        })

        if (!isExists) {
            return res.status(400).json({
                success: false,
                msg: 'User not found!'
            })
        }

        User.findByIdAndDelete({
            _id: id
        });

        return res.status(200).json({
            success: true,
            msg: 'User deleted successfully!'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser
}