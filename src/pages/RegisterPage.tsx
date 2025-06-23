// /src/pages/RegisterPage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerAPI } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'

interface FormState {
  username: string
  email:    string
  password: string
  role:     'agent' | 'qa' | 'admin'
}

export default function RegisterPage() {
  const { user } = useAuth()         // we know user.role === 'admin' here
  const navigate  = useNavigate()
  const [form, setForm] = useState<FormState>({
    username: '',
    email:    '',
    password: '',
    role:     'agent',
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await registerAPI(form)
      // on success, go back to chat or show a success banner
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="page-container">
      <h1>Create New User</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <label>
          Username
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </label>

        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="agent" >Agent</option>
            <option value="qa"    >QA</option>
            <option value="admin" >Admin</option>
          </select>
        </label>

        <button type="submit">Create User</button>
      </form>
    </div>
  )
}
