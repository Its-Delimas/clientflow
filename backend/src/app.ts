import express from "express"
import cors from "cors"
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes'
import { authGuard } from "./middleware/auth.middleware"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

//routes
app.use('/auth',authRoutes)

app.get('/health',authGuard,(_req,res)=>{
    res.json({status:'ok'})
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

export default app