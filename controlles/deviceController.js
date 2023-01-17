const uuid = require('uuid');
const path = require('path');
const { Device, DeviceInfo, Brand, Type } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));
      const device = await Device.create({ name, price, brandId, typeId, img: fileName });

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) =>
          DeviceInfo.create({
            description: i.description,
            highlights: i.highlights,
            deviceId: device.id,
          }),
        );
      }

      return res.json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getDeviceInfo(req, res, next) {
    try {
      let { name } = req.body;

      const device = await Device.findAll({
        where: {
          name: { [Op.eq]: name },
        },
        include: [
          {
            model: DeviceInfo,
            as: 'info',
          },
        ],
      });

      return res.json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async update(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));
      const device = await Device.update(
        { name, price, brandId, typeId, img: fileName },
        {
          where: {
            name,
            price,
            brandId,
            typeId,
            img: fileName,
          },
        },
      );

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) =>
          DeviceInfo.update(
            {
              description: i.description,
              highlights: i.highlights,
              deviceId: device.id,
            },
            {
              where: { description: i.description, highlights: i.highlights, deviceId: device.id },
            },
          ),
        );
      }

      return res.json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let devices;

    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({
        include: [
          {
            model: Brand,
          },
        ],
        limit,
        offset,
      });
    }

    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        include: [
          {
            model: Brand,
          },
        ],
        where: { brandId },
        limit,
        offset,
      });
    }

    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        include: [
          {
            model: Brand,
          },
        ],
        where: { typeId },
        limit,
        offset,
      });
    }

    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        include: [
          {
            model: Brand,
          },
        ],
        where: { typeId, brandId },
        limit,
        offset,
      });
    }
    return res.json(devices);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: 'info' }, { model: Brand }, { model: Type }],
    });
    return res.json(device);
  }
}

module.exports = new DeviceController();
