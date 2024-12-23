import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { StatusMedicamento } from '../types/enums'
import { scheduleService } from '../services/api'
import { toast } from 'react-toastify'

interface Schedule {
  id: string
  medicationId: string
  medication: {
    name: string
    dosage: string
  }
  time: string
  status: StatusMedicamento
}

export default function Dashboard() {
  const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  const loadTodaySchedules = async () => {
    try {
      setLoading(true)
      const data = await scheduleService.getTodaySchedules()
      console.log('Agendamentos carregados:', data)
      setTodaySchedules(data)
    } catch (error: any) {
      console.error('Erro ao carregar agendamentos:', error)
      toast.error('Erro ao carregar agendamentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodaySchedules()
  }, [])

  const handleStatusChange = async (scheduleId: string, status: StatusMedicamento) => {
    try {
      await scheduleService.updateStatus(scheduleId, status)
      // Recarrega os agendamentos após atualização
      await loadTodaySchedules()
      toast.success('Status atualizado com sucesso')
    } catch (error) {
      toast.error('Erro ao atualizar status')
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-lg">Carregando...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Medicamentos para Hoje</h1>
            <Link
              to="/schedules"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Gerenciar Agendamentos
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {todaySchedules.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">Nenhum medicamento agendado para hoje</p>
                <Link
                  to="/schedules"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clique aqui para adicionar um agendamento
                </Link>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medicamento
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horário
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todaySchedules
                    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
                    .map((schedule) => (
                      <tr key={schedule.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {schedule.medication.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {schedule.medication.dosage}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(schedule.time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTime(schedule.time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${schedule.status === StatusMedicamento.TOMADO ? 'bg-green-100 text-green-800' : 
                              schedule.status === StatusMedicamento.NAO_TOMADO ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {schedule.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                checked={schedule.status === StatusMedicamento.TOMADO}
                                onChange={() => handleStatusChange(schedule.id, StatusMedicamento.TOMADO)}
                                className="form-radio h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2">Tomou</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                checked={schedule.status === StatusMedicamento.NAO_TOMADO}
                                onChange={() => handleStatusChange(schedule.id, StatusMedicamento.NAO_TOMADO)}
                                className="form-radio h-5 w-5 text-red-600"
                              />
                              <span className="ml-2">Não tomou</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
