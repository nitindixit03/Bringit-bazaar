import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

if(!process.env.MONGODBURL){
    throw new Error( "Please provide MONGODBURL in the .env file")
}

async function db(){
    try {
        await mongoose.connect(process.env.MONGODBURL)
        console.log("MongoDB connected succesfully!")
    } catch (error) {
        console.log("Mongodb connection error", error)
        process.exit(1)
    }
}

export default db;
