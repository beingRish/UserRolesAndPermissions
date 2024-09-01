const User = require('../models/userModel');
const mongoose = require('mongoose');

const getUserPermissions = async(user_id) => {
    try {

        const user = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(user_id)
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

        return user[0];

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getUserPermissions
}