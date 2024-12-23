import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/api'
import { toast } from 'react-toastify'

interface LoginForm {
  email: string
  password: string
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>()
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await authService.login(data.email, data.password)
      login(response.token)
      toast.success('Login realizado com sucesso!')
      navigate('/')
    } catch (error) {
      toast.error('Email ou senha inválidos')
      console.error('Erro no login:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">Login MedControl</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Senha"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
        <div className="text-center space-y-2">
          <Link to="/register" className="text-blue-600 hover:text-blue-800 block">
            Novo usuário
          </Link>
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 block">
            Esqueci minha senha
          </Link>
        </div>
      </div>
    </div>
  )
}
