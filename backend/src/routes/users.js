import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const router = express.Router()
const prisma = new PrismaClient()

// Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { name: 'asc' }
    })
    res.json(users)
  } catch (error) {
    console.error('Erro ao listar usuários:', error)
    res.status(500).json({ error: 'Erro ao buscar usuários' })
  }
})

// Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }
    res.json(user)
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
})

// Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const { password, ...data } = req.body
    const updateData = { ...data }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })
    res.json(user)
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    res.status(500).json({ error: 'Erro ao atualizar usuário' })
  }
})

// Deletar usuário
router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    })
    res.status(204).send()
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    res.status(500).json({ error: 'Erro ao deletar usuário' })
  }
})

export default router
