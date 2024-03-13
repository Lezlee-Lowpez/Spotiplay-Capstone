require('dotenv').config()
const express = require('express')
const cors = require('cors')

const {SERVER_PORT} = process.env

const app = express()

app.use(cors())

// this line helps front end access back end
app.use(express.static(`${__dirname}/public`))
app.use(express.json())

const {getTrackInfo, getLogin, signUp, updateScore} = require('./controller')

// here we call all the functions from controller file to use on endpoints
app.get('/api/getTrackUrl', getTrackInfo)


app.post('/api/login', getLogin)


app.post('/api/signUp', signUp)

app.post('/api/updateScore', updateScore);

// here you set the application up on a port 
app.listen(SERVER_PORT, () => console.log(`I am running on port 5555 or ${process.env.SERVER_PORT}`))