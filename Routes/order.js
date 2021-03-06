const router = require ('express').Router()
const Order = require('../models/Order');
const {verifyTokenAndAuth, verifyTokenAndAdmin} = require("./verifyToken")

//Create
router.post("/", verifyTokenAndAuth, async (req, res)=>{
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    } catch (err) {
        res.status(500).json(err)
    }
})


//Update
router.put("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
            $set: req.body
        }, {new:true}); 
        res.status(200).json(updatedOrder)
    } catch (err) {
        res.status(500).json(err)
    }
})

//delete user Order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) =>{
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json('Order has been deleted...')
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get user Order
router.get("/find/:userId",verifyTokenAndAuth, async (req, res) =>{
    try {
        const Orders = await Order.find({userId: req.params.userId})
        res.status(200).json(Orders)
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get all 
router.get("/", verifyTokenAndAdmin, async (req, res) =>{
    try {
        const orders = await  Order.find()
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get monthly income
router.get("/income", verifyTokenAndAdmin, async (req, res)=>{
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() -1))
    const prevMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() -1))
    

    try {
        const incomes = await Order.aggregate([
            {$match: {createdAt: {$gte: prevMonth}}},
            {$project: {month: {$month: "$createdAt"},
                        sales: "$amount"}},
            {$group: {_id:"$month", total: {$sum: "$sales"}}}
        ])
        res.status(200).json(incomes)
    } catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router