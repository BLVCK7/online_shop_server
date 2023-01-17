const Router = require('express');
const router = new Router();
const UserController = require('../controlles/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/registration', UserController.registration);
router.post('/login', UserController.login);
router.get('/auth', authMiddleware, UserController.check);
router.get('/get-users', checkRoleMiddleware('ADMIN'), UserController.getUsers);

module.exports = router;
