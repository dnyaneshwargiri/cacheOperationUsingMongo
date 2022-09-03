const express = require('express')
const router = express.Router()
const Cache = require('../models/cache')

//get all cache keys
router.get('/getAllKeys', async(req,res) => {
    try{
        const caches = await Cache.find().select('key -_id')
        res.json(caches)
    }catch(err){
        res.send('Error ' + err)
    }
})
//get all cache entries
router.get('/', async(req,res) => {
    try{
           const caches = await Cache.find()
           res.json(caches)
    }catch(err){
        res.send(`Error:${err}`)
    }
})
//get cache by key
router.get('/:key', async(req,res) => {
    try{
           const cache = await Cache.find({key:req.params.key})
           if(cache.length>0) {
            let currentTime=Date.now()
            let cacheTTL=Date.parse(cache[0]._doc.timeToLive)
            console.log("Cache TTL- ",cacheTTL ) 
            console.log("Current TTL- ",currentTime)         
            //if cache is live
            if(cacheTTL > currentTime)
            {
                res.json(cache)
                console.log("Cache hit\n") 
            }
            else //if cache is not live
            {
                console.log("Cache expired\n")  
                //create new entry with random string
                let rs=makeRandomString(5)
                //update TTL
                let update={ key: req.params.key, data: rs,
                    timeToLive: new Date(new Date().getTime() + 5*60000) 
                    //now+ 5 mins is expiry time
                }   
                let query={key:req.params.key}        
                try{
                    Cache.findOneAndUpdate(query,update, {upsert: true,useFindAndModify:false}, function(err, doc) {
                        if (err)  res.send(500, {error: err});
                        res.json(cache)
                    });                                      
                }catch(err){
                    res.send(`Error:${err}`)
                } 
            }               
           }
           else {
            //if no cache present create random string
            console.log("Cache miss\n")            
            //create new entry with random string
            let rs=makeRandomString(5)
            const cache = new Cache({
                key: req.params.key,
                data: rs
            })
            try{
                const a1 =  await cache.save() 
                res.json(a1)
            }catch(err){
                res.send(`Error:${err}`)
            }          
    
          }

    }catch(err){
        res.send(`Error:${err}`)
    }
})
//create & update cache
router.post('/upsert', async(req,res) => {
    //check if cache exist then for logging purpose
    const tempCache = await Cache.find({key:req.body.key})
    let cacheExist =tempCache.length >0 ?true:false;
    timeToLive= new Date(new Date().getTime() + 5*60000); //now+ 5 mins is expiry time
    console.log("current time= ",new Date())
    console.log("expiry time of cache is 5 mins + current time= ",timeToLive)
    update={data:req.body.data,timeToLive:timeToLive}//this one i firs ttried to do using pre middleware bt there seems bug 
    // in pre findOneAndUpdate middile
    console.log('cache exist- ',cacheExist)
    let query = {key: req.body.key};
    //upsert operation
        Cache.findOneAndUpdate(query,update, {upsert: true,useFindAndModify:false}, function(err, doc) {
            if (err)  res.send(500, {error: err});
            res.send({message:'Cache succesfully saved.'});
        });    
})  
//remove single cache
router.delete('/deleteByKey/:key', async(req,res) => {
    try{
        const a1 =  await Cache.remove({key:req.params.key}) 
        res.json({message:`${req.params.key} is removed from cache`, data:a1})
    }catch(err){
        res.send(`Error:${err}`)
    }
})
//remove all cache
router.delete('/deleteAllKeys', async(req,res) => {
    try{
        const a1 =  await Cache.deleteMany({}) 
        res.json({message:`All keys are removed from cache`, data:a1})
    }catch(err){
        res.send(`Error:${err}`)
    }
})
//utility function to generate random string
function makeRandomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

module.exports = router