import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useForm } from 'react-hook-form'
import { StatusMedicamento } from '../types/enums'
import { scheduleService, medicationService } from '../services/api'
import { toast } from 'react-toastify'

interface Medication {
  id: string
  name: string
  dosage: string
}

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

export default function Schedules() {
  const [showForm, setShowForm] = useState(true)
  const [medications, setMedications] = useState<Medication[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const { register, handleSubmit, reset, setValue } = useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [medsData, schedulesData] = await Promise.all([
        medicationService.getAll(),
        scheduleService.getAll()
      ])
      setMedications(medsData)
      setSchedules(schedulesData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setValue('medicationId', schedule.medicationId)
    setValue('date', new Date(schedule.time).toISOString().split('T')[0])
    setValue('time', new Date(schedule.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = async (data: any) => {
    try {
      const scheduleData = {
        medicationId: data.medicationId,
        time: new Date(data.date + 'T' + data.time).toISOString(),
        status: StatusMedicamento.PENDENTE
      }

      if (editingSchedule) {
        const updated = await scheduleService.update(editingSchedule.id, scheduleData)
        setSchedules(schedules.map(s => s.id === editingSchedule.id ? updated : s))
        toast.success('Agendamento atualizado com sucesso')
        setEditingSchedule(null)
      } else {
        const newSchedule = await scheduleService.create(scheduleData)
        setSchedules([...schedules, newSchedule])
        toast.success('Agendamento criado com sucesso')
      }
      reset()
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error)
      toast.error('Erro ao salvar agendamento')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await scheduleService.delete(id)
        setSchedules(schedules.filter(schedule => schedule.id !== id))
        toast.success('Agendamento excluído com sucesso')
      } catch (error) {
        toast.error('Erro ao excluir agendamento')
      }
    }
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
          <h1 className="text-2xl font-bold mb-6">Gerenciar Agendamentos</h1>

          {/* Formulário de Agendamento */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-lg font-medium mb-4">
              {editingSchedule ? 'Editar Agendamento' : 'Novo Agendamento'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Medicamento
                </label>
                <select
                  {...register('medicationId')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Selecione um medicamento</option>
                  {medications.map(med => (
                    <option key={med.id} value={med.id}>
                      {med.name} - {med.dosage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data
                </label>
                <input
                  type="date"
                  {...register('date')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horário
                </label>
                <input
                  type="time"
                  {...register('time')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                {editingSchedule && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSchedule(null)
                      reset()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingSchedule ? 'Atualizar' : 'Adicionar'} Agendamento
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Agendamentos */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">
                Agendamentos Existentes
              </h3>
            </div>
            <div className="border-t border-gray-200">
              {schedules.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Nenhum agendamento cadastrado
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicamento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Horário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schedules
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
                            {new Date(schedule.time).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(schedule.time).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${schedule.status === StatusMedicamento.TOMADO ? 'bg-green-100 text-green-800' : 
                                schedule.status === StatusMedicamento.NAO_TOMADO ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'}`}>
                              {schedule.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(schedule)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(schedule.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
