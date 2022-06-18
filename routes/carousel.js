var express = require('express');
var router = express.Router();

// MODELS
const Carousel = require('../models/carousel')

//SAMPLE DATA
const c_data_sample = require('../samples/carousel')

router.get('/init', (req, res, next) => {
    try {
        Carousel.insertMany(c_data_sample.getSampleData)
    }
    catch (err) {
        console.log(err)
        return res.json({ code: 100, message: err.message })
    }
    return res.json({ code: 0, message: 'Khởi tạo dữ liệu thành công' })
})

router.get('/', (req, res, next) => {
    Carousel.find({})
    .then(result => {
        if (!result || result.length === 0) {
            return res.json({ code: 1, message: 'Không có dữ liệu tồn tại' })
        }
        return res.json({ code: 0, message: 'Lấy dữ liệu category thành công', data: result })
    })
    .catch(err => {
        return res.json({ code: 100, message: err })
    })
})

module.exports = router;