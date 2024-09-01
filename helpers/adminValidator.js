const { check } = require('express-validator');

exports.permissionAddValidator = [
    check('permission_name', 'permission_name is required').not().isEmpty(),
]

exports.permissionDeleteValidator = [
    check('id', 'id is required').not().isEmpty(),
]

exports.permissionUpdateValidator = [
    check('id', 'id is required').not().isEmpty(),
    check('permission_name', 'permission_name is required').not().isEmpty(),
]

exports.categoryAddValidator = [
    check('category_name', 'category_name is required').not().isEmpty(),
]

exports.categoryDeleteValidator = [
    check('id', 'id is required').not().isEmpty(),
]

exports.categoryUpdateValidator = [
    check('id', 'id is required').not().isEmpty(),
    check('category_name', 'category_name is required').not().isEmpty(),
]

exports.postCreateValidator = [
    check('title', 'title is required').not().isEmpty(),
    check('description', 'description is required').not().isEmpty(),
]

exports.postDeleteValidator = [
    check('id', 'id is required').not().isEmpty(),
]

exports.postUpdateValidator = [
    check('id', 'id is required').not().isEmpty(),
    check('title', 'title is required').not().isEmpty(),
    check('description', 'description is required').not().isEmpty(),
]

exports.storeRoleValidator = [
    check('role_name', 'role_name is required').not().isEmpty(),
    check('value', 'value is required').not().isEmpty(),
]

exports.addRouterPermissionValidator = [
    check('router_endpoint', 'router_endpoint is required').not().isEmpty(),
    check('role', 'role is required').not().isEmpty(),
    check('permission_id', 'permission_id is required').not().isEmpty(),
    check('permission', 'permission must be an array').isArray,
]

exports.getRouterPermissionValidator = [
    check('router_endpoint', 'router_endpoint is required').not().isEmpty(),
]