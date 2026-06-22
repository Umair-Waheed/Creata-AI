import express from "express"
import cors from "cors"
import "dotenv/config"
import { clerkMiddleware } from '@clerk/express'
import aiRoutes from "./routes/aiRoutes.js"
import connectCloudinary from "./configs/cloudinary.js"

const app=express()

await connectCloudinary()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())


app.get("/",(req,res)=>{
    res.send("Route is working!")
})  

// Every route we can create after getAuth(0) is protecting
// app.use(getAuth())

app.use('/api/ai',aiRoutes)

const PORT= process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
})