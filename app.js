import express from 'express'
import authRoutes from './routes/authRoutes.js'
import connection from './database/connection.js'
import { errorHandler, pathNotFound } from './middleware/errorMiddleware.js'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'
import patternRoutes from './routes/patternRoutes.js'
import taskRoutes from './routes/taskRoutes.js'

const app = express()
app.use(cors(
  ({
    origin: "http://localhost:5173", 
    credentials: true,              
  })
));
const port = 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Parent Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/pattern', patternRoutes)
app.use('/api/v1/task', taskRoutes)

// Error Handler
app.use(pathNotFound)
app.use(errorHandler)

// Koneksi Database
await connection()

// Server
app.listen(port, () => {
  console.log(`Aplikasi berjalan di port: ${port}`)
})
