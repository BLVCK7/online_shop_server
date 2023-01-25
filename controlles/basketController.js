const { BasketDevice, Device, Basket, User } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class BasketController {
  async getBasket(req, res, next) {
    try {
      let { userid } = req.body;
      console.log('req body:', req.body);
      console.log('userid:', userid);
      const device = await BasketDevice.findAll({
        where: { basketId: userid },
        include: [
          {
            model: Device,
          },
          {
            model: Basket,
            include: [
              {
                model: User,
              },
            ],
          },
        ],
      });

      return res.json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async addItemBasket(req, res, next) {
    try {
      let { userid, deviceid } = req.body;
      const device = await BasketDevice.create({ basketId: userid, deviceId: deviceid });

      return res.json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new BasketController();
