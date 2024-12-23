import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    res.status(201).json({ id: user.id, name: user.name, email: user.email })
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar usuário' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (error) {
    res.status(400).json({ error: 'Erro ao fazer login' })
  }
})

export default router
