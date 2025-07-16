

import mongoose from "mongoose";

/***
 * Connects to the database using mongoose
 * 
 * Uses the envirionment variable  DATABASE_URL
 * 
 */

export const connectDb = async () => {
    const mongoUri = process.env.DATABASE_URL


    if(!mongoUri){
        console.error("Environment variable for the Db is not defined")
        process.exit(1)
    }


    try{
        console.log("Establishing connection to the Db .....")


        const conn = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log(`MongoDb connected:${conn.connection.host}`)
        console.log(`Database name : ${conn.connection.name}`)

    }catch(error){
        console.error("Connection Failed ", error.message)
        process.exit(1)
    }
}