const { validationResult } = require('express-validator');
const Permission = require('../../models/permissionModel');

const addPermission = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation Errors',
                errors: errors.array()
            });
        }
        const { permission_name } = req.body;

        const isExists = await Permission.findOne({
            permission_name: {
                $regex: permission_name,
                $options: 'i'
            }
        });

        if (isExists) {
            return res.status(409).json({
                success: false,
                msg: 'Permission Name already exists!',
            });
        }
        var obj = {
            permission_name
        }
        if (req.body.default) {
            obj.is_default = parseInt(req.body.default);
        }
        const permission = new Permission(obj)
        const newPermission = await permission.save();

        return res.status(200).json({
            success: false,
            msg: 'Permission added Successfully!',
            data: newPermission
        });
    } catch {
        return res.status(500).json({
            success: false,
            msg: error.message
        });
    }
}

const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find({}).lean();

        return res.status(200).json({
            success: true,
            msg: 'Permission Fetched Successfully!',
            data: permissions
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        });
    }
}

const deletePermission = async (req, res) => {
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
        await Permission.findByIdAndDelete({ _id:id });

        return res.status(200).json({
            success: true,
            msg: 'Permission deleted Successfully!',
        });


    } catch {
        return res.status(500).json({
            success: false,
            msg: error.message
        });
    }
}

const updatePermission = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation Errors',
                errors: errors.array()
            });
        }

        const { id, permission_name } = req.body;

        const isExists = await Permission.findOne({ _id:id });

        if (!isExists) {
            return res.status(400).json({
                success: false,
                msg: 'Permission Id Not Found!',
            });
        }

        const isNameAssigned = await Permission.findOne({
            _id: { $ne: id },
            permission_name: {
                $regex: permission_name,
                $options: 'i'
            }
        });

        if (isNameAssigned) {
            return res.status(400).json({
                success: false,
                msg: 'Permission Name Already Assigned to another permission!',
            });
        }

        var updatePermission = {
            permission_name
        }

        if (req.body.default != null) {
            updatePermission.is_default = parseInt(req.body.default);
        }

        const updatedPermission = await Permission.findByIdAndUpdate({_id:id}, {
            $set: updatePermission
        }, { new: true });

        return res.status(200).json({
            success: false,
            msg: 'Permission updated Successfully!',
            data: updatedPermission
        });
    } catch {
        return res.status(500).json({
            success: false,
            msg: error.message
        });
    }
}

module.exports = {
    addPermission,
    getPermissions,
    deletePermission,
    updatePermission
}