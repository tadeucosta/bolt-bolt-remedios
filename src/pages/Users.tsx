import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useForm } from 'react-hook-form'
import { User } from '../types'
import api from '../services/api'

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const response = await api.get('/users')
    setUsers(response.data)
  }

  const onSubmit = async (data: any) => {
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, data)
      } else {
        await api.post('/users', data)
      }
      reset()
      setEditingId(null)
      fetchUsers()
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`)
      fetchUsers()
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register('name')}
                placeholder="Nome"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <input
                {...register('email')}
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <input
                {...register('password')}
                type="password"
                placeholder="Senha"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {editingId ? 'Atualizar' : 'Adicionar'} Usuário
            </button>
          </form>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => setEditingId(user.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
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
    </Layout>
  )
}
