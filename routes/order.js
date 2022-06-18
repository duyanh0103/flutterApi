var express = require('express');
const { route } = require('.');
var router = express.Router();

// MODELS
const Cart = require('../models/cart')
const Product = require('../models/product')

router.post('/:uid', (req, res, next)=>{
    let {uid} = req.params
    Cart.find({ cus_id: uid, oid: ""})
        .then(async (result) => {
            if (!result || result.length === 0) {
                return res.json({ code: 1, message: 'Không có dữ liệu tồn tại' })
            }
            else {
                Cart.updateOne({cus_id: uid, oid: ""},{oid: generateRandomID()})
                .then(()=>{
                    return res.json({ code: 0, message: 'Thanh toán đơn hàng thành công'})
                })
                .catch(err =>{
                    return res.json({ code: 100, message: err })
                })
            }
        })
        .catch(err => {
            return res.json({ code: 100, message: err })
        })
})

router.get('/:uid', (req, res, next)=>{
    let {uid} = req.params
    Cart.find({ cus_id: uid, oid: {$nin:""}})
    .then((result)=>{
        if(!result || result.length === 0){
            return res.json({ code: 1, message: 'Danh sách rỗng'})
        }
        return res.json({ code: 0, message: 'Lấy đơn hàng thành công', data: result})
    })
    .catch(err =>{
        return res.json({ code: 100, message: err })
    })
})

router.get('/:uid/:oid', (req, res, next)=>{
    let {uid,oid} = req.params
    Cart.find({ cus_id: uid, oid: oid})
    .then((result)=>{
        if(!result || result.length === 0){
            return res.json({ code: 1, message: 'Danh sách rỗng'})
        }
        return res.json({ code: 0, message: 'Lấy đơn hàng thành công', data: result})
    })
    .catch(err =>{
        return res.json({ code: 100, message: err })
    })
})

function generateRandomID(){
    return Math.floor(Math.random() * 10000000).toString();
}



module.exports = router;