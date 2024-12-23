import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">MedControl</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-900">
                  Dashboard
                </Link>
                <Link to="/medications" className="px-3 py-2 text-sm font-medium text-gray-900">
                  Medicamentos
                </Link>
                <Link to="/schedules" className="px-3 py-2 text-sm font-medium text-gray-900">
                  Agendamentos
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-500"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
