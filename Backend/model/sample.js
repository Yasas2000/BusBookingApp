const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    name:{
        require:true,
        type:String
    },
    age:{
        require:true,
        type:Number
    }
})

const SampleSchema = mongoose.model('Sample',dataSchema)

module.exports = SampleSchema