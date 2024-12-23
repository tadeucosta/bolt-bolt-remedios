import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useForm } from 'react-hook-form'

interface Medication {
  id: string
  name: string
  description: string
  dosage: string
}

export default function Medications() {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Dipirona',
      description: 'Analgésico e antitérmico',
      dosage: '500mg'
    },
    {
      id: '2',
      name: 'Paracetamol',
      description: 'Analgésico e antitérmico',
      dosage: '750mg'
    },
    {
      id: '3',
      name: 'Omeprazol',
      description: 'Protetor gástrico',
      dosage: '20mg'
    }
  ])

  const { register, handleSubmit, reset } = useForm()
  const [editingId, setEditingId] = useState<string | null>(null)

  const onSubmit = (data: any) => {
    if (editingId) {
      setMedications(medications.map(med => 
        med.id === editingId ? { ...data, id: editingId } : med
      ))
      setEditingId(null)
    } else {
      setMedications([...medications, { ...data, id: Date.now().toString() }])
    }
    reset()
  }

  const handleDelete = (id: string) => {
    setMedications(medications.filter(med => med.id !== id))
  }

  const handleEdit = (medication: Medication) => {
    setEditingId(medication.id)
    reset(medication)
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">
              {editingId ? 'Editar Medicamento' : 'Novo Medicamento'}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <input
                  {...register('description')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dosagem</label>
                <input
                  {...register('dosage')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {editingId ? 'Atualizar' : 'Adicionar'}
              </button>
            </form>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Lista de Medicamentos</h2>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {medications.map((medication) => (
                  <li key={medication.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                        <p className="text-sm text-gray-500">{medication.description}</p>
                        <p className="text-sm text-gray-500">Dosagem: {medication.dosage}</p>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEdit(medication)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(medication.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
