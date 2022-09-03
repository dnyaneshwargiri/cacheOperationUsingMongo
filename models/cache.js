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

//due to some mongoose bug pre middleware is stucking implmented this solution using custom code in routes/route.js
// cacheSchema.pre('findOneAndUpdate',true, async function(next) {
//     this.timeToLive=Date.now()
//     next();
// })

module.exports = mongoose.model('Cache',cacheSchema)