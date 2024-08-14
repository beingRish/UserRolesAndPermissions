const express = require('express');
const router = express();

const auth = require('../middlewares/authMiddleware')
const permissionController = require('../controllers/admin/permissionController');

const { onlyAdminAccess } = require('../middlewares/adminMiddleware')
const { permissionAddValidator, permissionDeleteValidator, permissionUpdateValidator } = require('../helpers/adminValidator')


// Permission Routes

router.post('/add-permission', auth, onlyAdminAccess, permissionAddValidator, permissionController.addPermission);
router.get('/get-permissions', auth, onlyAdminAccess,  permissionController.getPermissions);
router.post('/delete-permission', auth, onlyAdminAccess, permissionDeleteValidator, permissionController.deletePermission);
router.post('/update-permission', auth, onlyAdminAccess, permissionUpdateValidator, permissionController.updatePermission);

module.exports = router;