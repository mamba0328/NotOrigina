const mongoose = require('mongoose').default;

//DB connection
mongoose.set("strictQuery", false);

const mongoDB = process.env.DB_URI
async function connectMongoDB(req, res, next) {
    try{
        await mongoose.connect(mongoDB);
        next()
    }catch (error){
        console.log(error)
        next(error)
    }
}

module.exports = connectMongoDB;