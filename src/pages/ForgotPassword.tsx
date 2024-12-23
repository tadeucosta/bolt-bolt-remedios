import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: any) => {
    try {
      await api.post('/auth/forgot-password', data)
      alert('Se o email existir, você receberá instruções para redefinir sua senha.')
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">Esqueci minha senha</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Enviar instruções
          </button>
        </form>
        <div className="text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}
