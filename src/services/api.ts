import axios from 'axios'
import { toast } from 'react-toastify'

// Criação da instância do axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api'
})

// Interceptors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Serviços
const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      console.error('Erro no registro:', error)
      throw error
    }
  }
}

const medicationService = {
  getAll: async () => {
    try {
      const response = await api.get('/medications')
      return response.data
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error)
      throw error
    }
  },

  create: async (medication: any) => {
    try {
      const response = await api.post('/medications', medication)
      return response.data
    } catch (error) {
      console.error('Erro ao criar medicamento:', error)
      throw error
    }
  },

  update: async (id: string, medication: any) => {
    try {
      const response = await api.put(`/medications/${id}`, medication)
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar medicamento:', error)
      throw error
    }
  },

  delete: async (id: string) => {
    try {
      await api.delete(`/medications/${id}`)
    } catch (error) {
      console.error('Erro ao deletar medicamento:', error)
      throw error
    }
  }
}

const scheduleService = {
  getAll: async () => {
    try {
      const response = await api.get('/schedules')
      return response.data
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error)
      throw error
    }
  },

  getTodaySchedules: async () => {
    try {
      const response = await api.get('/schedules/today')
      return response.data
    } catch (error) {
      console.error('Erro ao buscar agendamentos do dia:', error)
      throw error
    }
  },

  create: async (schedule: any) => {
    try {
      const response = await api.post('/schedules', schedule)
      return response.data
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      throw error
    }
  },

  update: async (id: string, schedule: any) => {
    try {
      const response = await api.put(`/schedules/${id}`, schedule)
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error)
      throw error
    }
  },

  updateStatus: async (id: string, status: string) => {
    try {
      const response = await api.patch(`/schedules/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      throw error
    }
  },

  delete: async (id: string) => {
    try {
      await api.delete(`/schedules/${id}`)
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error)
      throw error
    }
  }
}

// Exportações
export {
  api as default,
  authService,
  medicationService,
  scheduleService
}
