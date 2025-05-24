const mongoose = require("mongoose");
require('dotenv').config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
    dbName: "bus_booking"
});
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})

module.exports = database;

