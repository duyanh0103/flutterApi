var express = require('express');
var router = express.Router();

// MODELS
const Rating = require('../models/rating')

//SAMPLE DATA
const r_data_sample = require('../samples/rating')

router.get('/init',(req, res, next)=>{
    try{
        Rating.insertMany(r_data_sample.getRatingData)
    }
    catch(err){
        console.log(err)
        return res.json({code:100, message:err.message})
    }
    return res.json({code:0, message:'Khởi tạo dữ liệu thành công'})
})

router.get('/:id', (req, res, next) => {
    let id = req.params.id
    Rating.find({ pid: id })
        .then(result => {
            if (!result) {
                return res.json({ code: 1, message: 'Không có dữ liệu tồn tại' })
            }
            return res.json({ code: 0, message: 'Lấy dữ liệu rating thành công', data: result })
        })
        .catch(err => {
            return res.json({ code: 100, message: err })
        })
})

module.exports = router;