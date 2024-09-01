const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware')

const permissionController = require('../controllers/admin/permissionController');

const roleController = require('../controllers/admin/roleController');

const { onlyAdminAccess } = require('../middlewares/adminMiddleware')

const {
    permissionAddValidator,
    permissionDeleteValidator,
    permissionUpdateValidator,
    storeRoleValidator,

} = require('../helpers/adminValidator')


// Permission Routes

router.post(
    '/add-permission',
    auth,
    onlyAdminAccess,
    permissionAddValidator,
    permissionController.addPermission
);

router.get(
    '/get-permissions',
    auth,
    onlyAdminAccess,
    permissionController.getPermissions
);

router.post(
    '/delete-permission',
    auth,
    onlyAdminAccess,
    permissionDeleteValidator,
    permissionController.deletePermission
);

router.post(
    '/update-permission',
    auth,
    onlyAdminAccess,
    permissionUpdateValidator,
    permissionController.updatePermission
);

// role routes

router.post(
    '/store-role',
    auth,
    storeRoleValidator,
    onlyAdminAccess,
    roleController.storeRole
);

router.get(
    '/get-roles',
    auth,
    onlyAdminAccess,
    roleController.getRoles
);


module.exports = router;