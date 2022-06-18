var express = require('express');
var router = express.Router();

// MODELS
const Product = require('../models/product')

//SAMPLE DATA
const p_data_sample = require('../samples/prouduct')

/* RETURN CODE TYPE:
  0 : Success
  1 : Error No Data
  100 : Other errors
*/

router.get('/init', (req, res, next) => {
    try {
        Product.insertMany(p_data_sample.getSampleData)
    }
    catch (err) {
        console.log(err)
        return res.json({ code: 100, message: err.message })
    }
    return res.json({ code: 0, message: 'Khởi tạo dữ liệu thành công' })
})

router.get('/', (req, res, next) => {
    Product.find({})
        .then(result => {
            return res.json({ code: 0, message: 'Lấy dữ liệu product thành công', data: result })
        })
        .catch(err => {
            return res.json({ code: 100, message: err })
        })
})

router.get('/:id', (req, res, next) => {
    let id = req.params.id
    Product.findOne({ pid: id })
        .then(result => {
            if (!result) {
                return res.json({ code: 1, message: 'Không có dữ liệu tồn tại' })
            }
            return res.json({ code: 0, message: 'Lấy dữ liệu product thành công', data: result })
        })
        .catch(err => {
            return res.json({ code: 100, message: err })
        })
})

router.get('/search/:query', (req, res, next) => {
    let query = req.params.query
    Product.find({title: {$regex: query, $options: 'i'}})
        .then(result => {
            if (!result || result.length<1) {
                return res.json({ code: 1, message: 'Không có dữ liệu tồn tại' })
            }
            return res.json({ code: 0, message: 'Lấy dữ liệu product thành công', data: result })
        })
        .catch(err => {
            return res.json({ code: 100, message: err })
        })
})

module.exports = router;
