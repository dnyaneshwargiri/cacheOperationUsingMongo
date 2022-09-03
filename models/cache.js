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

//code for capped collection- need to add in new Schema above after deleting curret object
//
//{capped:{size: 5120, max: 1000,autoIndexId: true}}
//cusotm middleware function for TTL

//due to some mongoose bug pre middleware is stucking implmented this solution using custom code in routes/route.js
// cacheSchema.pre('findOneAndUpdate',true, async function(next) {
//     this.timeToLive=Date.now()
//     next();
// })

module.exports = mongoose.model('Cache',cacheSchema)