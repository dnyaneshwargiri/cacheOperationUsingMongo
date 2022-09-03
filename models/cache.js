const mongoose = require('mongoose')

const cacheSchema = new mongoose.Schema({

    key: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    timeToLive:{
        type: Date           
    }

})
//cusotm middleware function for TTL
cacheSchema.pre.save=function(doc,next) {
    this.timeToLive=Date.now()
    console.log()
    next();
}

module.exports = mongoose.model('Cache',cacheSchema)