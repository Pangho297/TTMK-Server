const sequelize = require('sequelize');
const Op = sequelize.Op;
const { Item: ItemModel } = require('../models');

module.exports = {
  'keyword': async (req, res) => {
    // console.log(req.query); // {keyword: '맥북, city: '서울시 마포구', offset: 1}
    const { keyword, city, offset } = req.query;
    const today = new Date();
    // 검색어로 아이템 이름 검색
    if (keyword) {
      ItemModel.findAll({
        offset: Number(offset) || 0,
        limit: 5,
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: '%' + keyword + '%'
            }
          },
          {
            description: {
              [Op.like]: '%' + keyword + '%'
            }
          }],
          [Op.and]: {
            endTime: {
              [Op.gt]: today,
            }
          }
        }
      })
        .then((result) => {
          if (result.length) {
            let items = result.map((item) => {
              item.dataValues.city = city;
              return item.dataValues;
            });
            res.status(200).json({ items });
          } else {
            const items = [];
            res.status(204).json({ items });
          }
        }).catch(() => {
          res.status(500).json({ 'message': 'Fail to load data from database' });
        });
    }
    // 랜딩페이지에서 다음 페이지로 이동하는 순간 지역에 대한 정보가 들어 올 예정
    else {
      const today = new Date();
      ItemModel.findAll({
        offset: Number(offset) || 0,
        limit: 5,
        where: {
          endTime: {
            [Op.gt]: today,
          }
        },
      })
        .then((result) => {
          if (result.length) {
            let items = result.map((item) => {
              item.dataValues.city = city;
              return item.dataValues;
            });
            res.status(200).json({ items });
          } else {
            const items = [];
            res.status(204).json({ items });
          }
        }).catch(() => {
          res.status(500).json({ 'message': 'Fail to load data from database' });
        });
    }
  }
};