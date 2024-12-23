import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Rota para criar medicamentos de teste (colocando antes das outras rotas)
router.post('/seed', async (req, res) => {
  try {
    const medicamentos = [
      {
        name: 'Dipirona',
        description: 'Analgésico e antitérmico',
        dosage: '500mg'
      },
      {
        name: 'Paracetamol',
        description: 'Analgésico e antitérmico',
        dosage: '750mg'
      },
      {
        name: 'Omeprazol',
        description: 'Protetor gástrico',
        dosage: '20mg'
      },
      {
        name: 'Amoxicilina',
        description: 'Antibiótico',
        dosage: '500mg'
      }
    ]

    const created = await prisma.$transaction(
      medicamentos.map(med => 
        prisma.medication.create({
          data: med
        })
      )
    )

    res.json({ 
      message: `${created.length} medicamentos criados`,
      medications: created 
    })
  } catch (error) {
    console.error('Erro ao criar medicamentos de teste:', error)
    res.status(500).json({ error: 'Erro ao criar medicamentos de teste' })
  }
})

// Listar todos os medicamentos
router.get('/', async (req, res) => {
  try {
    const medications = await prisma.medication.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(medications)
  } catch (error) {
    console.error('Erro ao listar medicamentos:', error)
    res.status(500).json({ error: 'Erro ao buscar medicamentos' })
  }
})

// Buscar medicamento por ID
router.get('/:id', async (req, res) => {
  try {
    const medication = await prisma.medication.findUnique({
      where: { id: req.params.id }
    })
    if (!medication) {
      return res.status(404).json({ error: 'Medicamento não encontrado' })
    }
    res.json(medication)
  } catch (error) {
    console.error('Erro ao buscar medicamento:', error)
    res.status(500).json({ error: 'Erro ao buscar medicamento' })
  }
})

// Criar medicamento
router.post('/', async (req, res) => {
  try {
    const medication = await prisma.medication.create({
      data: req.body
    })
    res.status(201).json(medication)
  } catch (error) {
    console.error('Erro ao criar medicamento:', error)
    res.status(500).json({ error: 'Erro ao criar medicamento' })
  }
})

// Atualizar medicamento
router.put('/:id', async (req, res) => {
  try {
    const medication = await prisma.medication.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json(medication)
  } catch (error) {
    console.error('Erro ao atualizar medicamento:', error)
    res.status(500).json({ error: 'Erro ao atualizar medicamento' })
  }
})

// Deletar medicamento
router.delete('/:id', async (req, res) => {
  try {
    await prisma.medication.delete({
      where: { id: req.params.id }
    })
    res.status(204).send()
  } catch (error) {
    console.error('Erro ao deletar medicamento:', error)
    res.status(500).json({ error: 'Erro ao deletar medicamento' })
  }
})

export default router
