const Router = require('express');
const router = new Router();
const basketController = require('../controlles/basketController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', basketController.getBasket);

module.exports = router;
