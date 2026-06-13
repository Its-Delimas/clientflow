import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes'
import clientRoutes from './routes/client.routes'
import { logger } from './middleware/logger.middleware'
import { errorHandler } from './middleware/error.middleware'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

app.use('/auth', authRoutes)
app.use('/clients', clientRoutes)

app.use(errorHandler)
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
