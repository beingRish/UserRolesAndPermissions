const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware')

const categoryController = require('../controllers/categoryController');
const postController = require('../controllers/postController');
const userController = require('../controllers/userController')
const likeController = require('../controllers/likeController')

const checkPermission = require('../middlewares/checkPermission')

const {
    categoryAddValidator,
    categoryDeleteValidator,
    categoryUpdateValidator,
    postCreateValidator,
    postDeleteValidator,
    postUpdateValidator
} = require('../helpers/adminValidator')

const {
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    postLikeUnlikeValidator,
    postLikeCountValidator
} = require('../helpers/validator')

// category routes
router.post(
    '/add-category',
    checkPermission,
    auth,
    categoryAddValidator,
    categoryController.addCategory
);

router.get(
    '/get-categories',
    auth,
    checkPermission,
    categoryController.getCategories
);

router.post(
    '/delete-category',
    auth,
    checkPermission,
    categoryDeleteValidator,
    categoryController.deleteCategory
);

router.post(
    '/update-category',
    auth,
    checkPermission,
    categoryUpdateValidator,
    categoryController.updateCategory
);


// post routes
router.post(
    '/create-post',
    auth,
    checkPermission,
    postCreateValidator,
    postController.createPost
)

router.get(
    '/get-posts',
    auth,
    checkPermission,
    postController.getPosts
)

router.post(
    '/delete-post',
    auth,
    checkPermission,
    postDeleteValidator,
    postController.deletePost
)

router.post(
    '/update-post',
    auth,
    checkPermission,
    postUpdateValidator,
    postController.updatePost
)

// user routes
router.post(
    '/create-user',
    auth,
    checkPermission,
    createUserValidator,
    userController.createUser
)

router.get(
    '/get-users',
    auth,
    checkPermission,
    userController.getUsers
)

router.post(
    '/update-user',
    auth,
    checkPermission,
    updateUserValidator,
    userController.updateUser
)

router.post(
    '/delete-user',
    auth,
    checkPermission,
    deleteUserValidator,
    userController.deleteUser
)

// like & unlike routes

router.post(
    '/post-like',
    auth,
    checkPermission,
    postLikeUnlikeValidator,
    likeController.postLike
)

router.post(
    '/post-unlike',
    auth,
    checkPermission,
    postLikeUnlikeValidator,
    likeController.postUnlike
)

router.post(
    '/post-like-count',
    auth,
    checkPermission,
    postLikeCountValidator,
    likeController.postLikeCount
)

module.exports = router;