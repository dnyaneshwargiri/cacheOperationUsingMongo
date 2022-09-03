const express = require('express')
const mongoose = require('mongoose')
//this is mongodb my free cloud hosted 
const url = 'mongodb+srv://test:test@cluster0.msur3yq.mongodb.net/?retryWrites=true&w=majority'

instance 

const app = express()

mongoose.connect(url, {useNewUrlParser:true})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})

app.use(express.json())

const cacheRouter = require('./routes/cache')
app.use('/cache',cacheRouter)

app.listen(9000, () => {
    console.log('Server started')
})