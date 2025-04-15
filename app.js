import express from 'express'
import authRoutes from './routes/authRoutes.js'
import connection from './database/connection.js'
import { errorHandler, pathNotFound } from './middleware/errorMiddleware.js'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'

const app = express()
const port = 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Parent Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)

// Error Handler
app.use(pathNotFound)
app.use(errorHandler)

// Koneksi Database
await connection()

// Server
app.listen(port, () => {
  console.log(`Aplikasi berjalan di port: ${port}`)
})
