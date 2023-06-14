const mongoose = require('mongoose')

require('dotenv').config()
const connect = async(req,res) => {
    mongoose.connect(process.env.DATABASE_URL , {
        useUnifiedTopology : true,
        useNewUrlParser : true
    })
    .then(() => {console.log("Connection with db established successfully")})
    .catch((err) => (console.log(err)))
}

module.exports = connect