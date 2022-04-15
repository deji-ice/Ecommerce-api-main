const express = require ('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
const cors = require("cors")
dotenv.config()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
//routes
const userRoute = require("./Routes/user")
const authRoute = require("./Routes/auth")
const productRoute = require("./Routes/product")
const orderRoute = require("./Routes/order")
const cartRoute = require("./Routes/cart")
const stripeRoute = require("./Routes/stripe")

mongoose.connect(process.env.MONGO_URL)
                .then(()=>console.log("database connected"))
                .catch((err)=>console.log(err))

app.get("/api/test", ()=>{
    console.log('test is successfull');
})

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/orders", orderRoute)
app.use("/api/cart", cartRoute)
app.use("/api/checkout", stripeRoute)

app.listen(process.env.PORT || 5000 , ()=>{
    console.log('Listening on port  5000');
})