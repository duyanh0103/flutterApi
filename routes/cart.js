var express = require('express');
const { route } = require('.');
var router = express.Router();

// MODELS
const Cart = require('../models/cart')
const Product = require('../models/product')

//SAMPLE DATA
const c_data_sample = require('../samples/cart')

router.get('/init', (req, res, next) => {
    try {
        Cart.insertMany(c_data_sample.getSampleData)
    }
    catch (err) {
        console.log(err)
        return res.json({ code: 100, message: err.message })
    }
    return res.json({ code: 0, message: 'Khởi tạo dữ liệu thành công' })
})

router.get('/:uid', (req, res, next) => {
    let uid = req.params.uid
    Cart.find({ cus_id: uid, oid:""})
        .then(result => {
            if (!result || result.length === 0) {
                return res.json({ code: 1, message: 'Không có dữ liệu tồn tại' })
            }
            return res.json({ code: 0, message: 'Lấy dữ liệu cart thành công', data: result })
        })
        .catch(err => {
            return res.json({ code: 100, message: err })
        })
})

router.post('/:uid/:pid', async (req, res, next) => {
    let uid = req.params.uid
    let pid = req.params.pid
    let isPID = ""

    Cart.find({ cus_id: uid, oid: ""})
        .then(async (result) => {
            if (!result || result.length === 0) {
                Cart.insertMany([{ cus_id: uid, oid: "" }])
                    .then(async () => {
                        // let isPIDPromise = checkPID(pid)
                        // isPIDPromise.then((result2) =>{
                            isPID = await checkPID(pid)
                            if (isPID!=null) {
                                Cart.updateOne({ cus_id: uid, oid: "" }, { items: [{
                                    pid: isPID.pid,
                                    price: isPID.price,
                                    title: isPID.title,
                                    url: isPID.url,
                                    quantity:1
                                }] })
                                    .then(result => {
                                        if (!result) {
                                            return res.json({ code: 1, message: 'Không có dữ liệu tồn tại' })
                                        }
                                        return res.json({ code: 0, message: 'Thêm item vào order thành công 3' })
                                    })
                                    .catch(err => {
                                        return res.json({ code: 100, message: err })
                                    })
                            }
                            else{
                                return res.json({ code: 101, message: 'PID không hợp lệ' })
                            }
                        })
                    //})
                    .catch(err => {
                        return res.json({ code: 100, message: err })
                    })
            }
            else {
                isPID = await checkPID(pid)
                if (isPID) {
                    // let isDuplicate = await checkPIDwithOrderCreated(pid, uid)
                    let dupPromise = checkPIDwithOrderCreated(pid, uid)
                    dupPromise.then((isDuplicate) => {
                        if (isDuplicate == 0) {
                            Product.findOne({ pid: pid })
                                .then(result => {
                                    if (!result) {
                                        return res.json({ code: 1, message: 'Không có dữ liệu tồn tại' })
                                    }
                                    Cart.updateOne({ cus_id: uid, oid: "" }, {
                                        $push: {
                                            items: {
                                                pid: result.pid,
                                                price: result.price,
                                                title: result.title,
                                                url: result.url,
                                                quantity: 1
                                            }
                                        }
                                    })
                                        .then(result => {
                                            return res.json({ code: 0, message: "Thêm item vào order thành công 2" })
                                        })
                                        .catch(err => {
                                            return res.json({ code: 1, message: err })
                                        })
                                })
                        }
                        else if (isDuplicate == 1) {
                            Cart.updateOne({ cus_id: uid, oid: "", "items.pid": pid }, {
                                $inc: { "items.$.quantity": 1 } 
                            })
                                .then(result => {
                                    return res.json({ code: 0, message: "Thêm item vào order thành công 1" })
                                })
                                .catch(err => {
                                    return res.json({ code: 100, message: err })
                                })
                        }
                        else {
                            return res.json({ code: 100, message: 'OPID không hợp lệ' })
                        }
                    })

                }
                else {
                    return res.json({ code: 101, message: 'PID không hợp lệ' })
                }
            }
        })
        .catch(err => {
            return res.json({ code: 100, message: err })
        })
})

router.put('/:uid/:pid', async (req, res, next) => {
    let uid = req.params.uid
    let pid = req.params.pid
    let isPID = ""

    Cart.find({ cus_id: uid, oid: ""})
        .then(async (result) => {
            if (!result || result.length === 0) {
                return res.json({ code: 1, message: 'Không có dữ liệu tồn tại' })
            }
            else {
                isPID = await checkPID(pid)
                if (isPID) {
                    let dupPromise = checkPIDwithOrderCreated(pid, uid)
                    dupPromise.then((isDuplicate) => {
                        if (isDuplicate == 0) {
                            return res.json({code:1, message: 'Không tìm thấy item trong order'})
                        }
                        else if (isDuplicate == 1) {
                            Cart.updateOne({ cus_id: uid, oid: "", "items.pid": pid }, {
                                $inc: { "items.$.quantity": -1 } 
                            })
                                .then(() => {
                                    Cart.updateOne({ cus_id: uid, oid: "", "items.pid": pid }, {
                                        $pull: {items: {quantity:0} }
                                    })
                                    .then(()=>{
                                        return res.json({ code: 0, message: "Chỉnh sửa item vào order thành công" })
                                    })
                                    .catch(err => {
                                        return res.json({ code: 100, message: err })
                                    })
                                })
                                .catch(err => {
                                    return res.json({ code: 100, message: err })
                                })
                        }
                        else {
                            return res.json({ code: 100, message: 'OPID không hợp lệ' })
                        }
                    })

                }
                else {
                    return res.json({ code: 101, message: 'PID không hợp lệ' })
                }
            }
        })
        .catch(err => {
            return res.json({ code: 100, message: err })
        })
})

router.delete('/:uid/:pid', async (req, res, next) => {
    let uid = req.params.uid
    let pid = req.params.pid
    let isPID = ""

    Cart.find({ cus_id: uid, oid: ""})
        .then(async (result) => {
            if (!result || result.length === 0) {
                return res.json({ code: 1, message: 'Không có dữ liệu tồn tại' })
            }
            else {
                isPID = await checkPID(pid)
                if (isPID) {
                    let dupPromise = checkPIDwithOrderCreated(pid, uid)
                    dupPromise.then((isDuplicate) => {
                        if (isDuplicate == 0) {
                            return res.json({code:1, message: 'Không tìm thấy item trong order'})
                        }
                        else if (isDuplicate == 1) {
                            Cart.updateOne({ cus_id: uid, oid: ""}, {
                                $pull: {items: {pid:pid} }
                            })
                            .then(()=>{
                                return res.json({ code: 0, message: "Xoá item vào order thành công" })
                            })
                            .catch(err => {
                                return res.json({ code: 100, message: err })
                            })
                        }
                        else {
                            return res.json({ code: 100, message: 'OPID không hợp lệ' })
                        }
                    })

                }
                else {
                    return res.json({ code: 101, message: 'PID không hợp lệ' })
                }
            }
        })
        .catch(err => {
            return res.json({ code: 100, message: err })
        })
})

function checkPID(pid) {
    return new Promise(resolve => {
        Product.findOne({ pid: pid })
            .then(result => {
                if (!result) {
                    resolve(null)
                }
                else {
                    resolve(result)
                }
            })
            .catch(err => {
                resolve(null)
            })
    })
}

function checkPIDwithOrderCreated(pid, uid) {
    return new Promise(resolve => {
        Cart.findOne({ cus_id: uid, oid: "", "items.pid": pid })
            .then(result => {
                if (!result) {
                    resolve(0)
                }
                else {
                    resolve(1)
                }
            })
            .catch(err => {
                resolve(-1)
            })
    })
}

router.get('/demo/:uid/:pid', (req, res, next) => {
    let { pid, uid } = req.params
    Cart.findOne({ cus_id: uid, oid: "", "items.pid": pid })
        .then(result => {
            if (!result) {
                return res.json({ code: 1, message: result })
            }
            else {
                return res.json({ code: 0, message: result })
            }
        })
        .catch(err => {
            return res.json({ code: 100, message: err })
        })
})

router.get('/demo2/:pid',async (req, res, next)=>{
    let pid = req.params.pid
    let data = await checkPID(pid)
    return res.json({datas: data})
})

module.exports = router;