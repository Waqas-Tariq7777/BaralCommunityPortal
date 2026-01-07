import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./DB/connect.js";

dotenv.config({ path: "./.env"})
const port = process.env.PORT || 4000

connectDB()
.then(() =>{
    app.listen(port, (req, res)=>{
        console.log("Server is successfully running on port: ", port)
    })
})
.catch((error) =>{
    console.log("MONGODB Connection Error:", error)
})
