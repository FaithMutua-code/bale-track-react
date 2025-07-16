import express from  'express'
import cors from 'cors'
import 'dotenv/config'
import {connectDb} from './src/config/db.js'


//app config
const app = express()


//defining the Port No
const PORT = process.env.PORT || 3000

//middleware
app.use(express.json())
app.use(cors())


//accessing the db
connectDb()




//api endpoints




//return message on the browser
app.get('/', (req, res) => {
    res.send("Hello Backend")

})


app.listen( PORT, () => {
    console.log(`Server is running on  http:localhost:${PORT}`)
})