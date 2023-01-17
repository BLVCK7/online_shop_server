const Router = require('express');
const router = new Router();
const DeviceController = require('../controlles/deviceController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', DeviceController.create);
router.get('/', DeviceController.getAll);
router.get('/:id', DeviceController.getOne);
router.patch('/', DeviceController.update);
router.post('/info', DeviceController.getDeviceInfo);

module.exports = router;
