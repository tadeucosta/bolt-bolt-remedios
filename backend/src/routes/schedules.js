import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Listar todos os agendamentos
router.get('/', async (req, res) => {
  try {
    console.log('Buscando todos os agendamentos')
    const schedules = await prisma.schedule.findMany({
      include: {
        medication: true
      },
      orderBy: {
        time: 'asc'
      }
    })
    res.json(schedules)
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error)
    res.status(500).json({ error: 'Erro ao buscar agendamentos' })
  }
})

// Buscar agendamentos do dia - IMPORTANTE: esta rota deve vir antes das rotas com :id
router.get('/today', async (req, res) => {
  try {
    console.log('Buscando agendamentos do dia para usuário:', req.user.id)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    console.log('Período de busca:', { today, tomorrow })

    const schedules = await prisma.schedule.findMany({
      where: {
        userId: req.user.id,
        time: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        medication: true
      },
      orderBy: {
        time: 'asc'
      }
    })

    console.log('Agendamentos encontrados:', schedules.length)
    res.json(schedules)
  } catch (error) {
    console.error('Erro ao buscar agendamentos do dia:', error)
    res.status(500).json({ error: 'Erro ao buscar agendamentos do dia' })
  }
})

// Criar agendamento
router.post('/', async (req, res) => {
  try {
    console.log('Criando agendamento:', req.body)
    const { medicationId, time, status } = req.body
    const schedule = await prisma.schedule.create({
      data: {
        medicationId,
        time: new Date(time),
        status,
        userId: req.user.id
      },
      include: {
        medication: true
      }
    })
    console.log('Agendamento criado:', schedule)
    res.status(201).json(schedule)
  } catch (error) {
    console.error('Erro ao criar agendamento:', error)
    res.status(500).json({ error: 'Erro ao criar agendamento' })
  }
})

// Atualizar agendamento
router.put('/:id', async (req, res) => {
  try {
    console.log('Atualizando agendamento:', req.params.id, req.body)
    const { id } = req.params
    const { medicationId, time, status } = req.body

    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        medicationId,
        time: new Date(time),
        status
      },
      include: {
        medication: true
      }
    })
    console.log('Agendamento atualizado:', schedule)
    res.json(schedule)
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error)
    res.status(500).json({ error: 'Erro ao atualizar agendamento' })
  }
})

// Atualizar status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const schedule = await prisma.schedule.update({
      where: { id },
      data: { status },
      include: {
        medication: true
      }
    })
    res.json(schedule)
  } catch (error) {
    console.error('Erro ao atualizar status:', error)
    res.status(500).json({ error: 'Erro ao atualizar status' })
  }
})

// Deletar agendamento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.schedule.delete({
      where: { id }
    })
    res.status(204).send()
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error)
    res.status(500).json({ error: 'Erro ao deletar agendamento' })
  }
})

export default router
