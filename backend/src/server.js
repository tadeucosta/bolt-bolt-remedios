import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import medicationRoutes from './routes/medications.js'
import scheduleRoutes from './routes/schedules.js'
import { authenticateToken } from './middleware/auth.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/medications', authenticateToken, medicationRoutes)
app.use('/api/schedules', authenticateToken, scheduleRoutes)

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

// Start server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})
