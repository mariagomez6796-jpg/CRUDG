"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, UserCircle } from "lucide-react"
import { authService, type UserRole } from "@/lib/auth"





export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("patient")
  const [isLoading, setIsLoading] = useState(false)
  const [serverRoleState, setServerRoleState] = useState<string | null>(null)
  const [lastResponse, setLastResponse] = useState<any | null>(null)
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
  const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
          // send role so backend can validate/return correct user
          body: JSON.stringify({ email, password, role }),
        });
      if (!res.ok) {
        // try to read error message from backend
        const err = await res.json().catch(() => null)
        const msg = err?.message || 'Correo o contraseña incorrectos.'
        throw new Error(msg)
      }
      const data = await res.json();

    // Normalize and trim server role and selected role for robust comparison
  const serverRoleRaw = (data.role ?? '')
  const rawSelected = String(role ?? '')

  const normalizeRole = (input: string) => {
  const s = String(input ?? '').trim().toLowerCase()
  if (!s) return ''
  if (s === 'admin' || s === 'administrator' || s === 'administrador' || s === 'administration' || s === 'adm') return 'admin'
  if (s === 'doctor' || s === 'medico' || s === 'medicina' || s === 'doc') return 'doctor'
  if (s === 'patient' || s === 'paciente' || s === 'user' || s === 'pac') return 'patient'
  if (s.includes('admin') || s.includes('administr')) return 'admin'
  if (s.includes('doctor') || s.includes('medic') || s.includes('medico')) return 'doctor'
  if (s.includes('patient') || s.includes('paciente')) return 'patient'
  return ''
  }

  const serverRole = normalizeRole(serverRoleRaw)
  const selectedRole = normalizeRole(rawSelected)
  setServerRoleState(serverRole)
  console.log('Usuario autenticado (raw):', data)
  setLastResponse(data)
  console.log('selectedRole(normalized):', selectedRole, 'serverRole(normalized):', serverRole)

      // Ensure token and role exist
      if (!data.token) {
        setErrorMessage('Respuesta inválida del servidor: falta token.')
        // ensure no stale user left
        localStorage.removeItem('user')
        return
      }

      // Validate that selected role matches returned role
      if (serverRole && serverRole !== selectedRole) {
        setErrorMessage('El tipo de cuenta seleccionado no coincide con el usuario. Seleccionaste "' + selectedRole + '" pero la cuenta es "' + serverRole + '".')
        // clear any tokens/user just in case
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('email')
        localStorage.removeItem('user')
        return
      }

      // Save token and role in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', serverRole)
  const emailToStore = data.email ?? data.emailAddres ?? data.emailAddress ?? ''
  localStorage.setItem('email', emailToStore)

      // Also save the user object expected by authService
      try {
  const userObj = { email: data.email ?? data.emailAddres ?? data.emailAddress ?? '', role: serverRole, token: data.token }
        localStorage.setItem('user', JSON.stringify(userObj))
      } catch (e) {
        console.error('No se pudo guardar user en localStorage', e)
      }

      // Redirect based on normalized role
      if (serverRole === 'admin') {
        const msg = 'Redirigiendo a /admin'
        console.log(msg)
        setRedirectMessage(msg)
        router.push('/admin')
        // fallback: force navigation after small delay if router.push doesn't work
        setTimeout(() => { if (window.location.pathname === '/') window.location.href = '/admin' }, 600)
        return
      } else if (serverRole === 'doctor') {
        const msg = 'Redirigiendo a /doctor'
        console.log(msg)
        setRedirectMessage(msg)
        router.push('/doctor')
        setTimeout(() => { if (window.location.pathname === '/') window.location.href = '/doctor' }, 600)
        return
      } else if (serverRole === 'patient') {
        const msg = 'Redirigiendo a /patient'
        console.log(msg)
        setRedirectMessage(msg)
        router.push('/patient')
        setTimeout(() => { if (window.location.pathname === '/') window.location.href = '/patient' }, 600)
        return
      } else {
        setErrorMessage('No se pudo identificar el tipo de cuenta devuelto por el servidor: "' + String(data.role) + '"')
        return
      }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    const msg = error instanceof Error ? error.message : 'Error al iniciar sesión.'
    setErrorMessage(msg)
  } finally {
    setIsLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium">
            Tipo de cuenta
          </Label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full h-12 pl-10 pr-4 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="patient">Paciente</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </Label>
            <button type="button" className="text-sm text-primary hover:underline focus:outline-none focus:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>

      {errorMessage && (
        <div className="text-sm text-red-600 mt-2" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Diagnostic panel - remove in production */}
      <div className="mt-3 text-sm text-muted-foreground">
        <div>Selected role (local): <strong>{role}</strong></div>
        <div>Server role (normalized): <strong>{serverRoleState ?? '-'}</strong></div>
        {redirectMessage && <div className="text-green-700">{redirectMessage}</div>}
        {lastResponse && (
          <details className="mt-2 p-2 border rounded bg-gray-50 text-xs">
            <summary>Respuesta del servidor (diagnóstico)</summary>
            <pre className="whitespace-pre-wrap">{JSON.stringify(lastResponse, null, 2)}</pre>
          </details>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">O continúa con</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          className="h-12 bg-transparent"
          onClick={() => console.log("Google login")}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
            />
          </svg>
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 bg-transparent"
          onClick={() => console.log("Apple login")}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          Apple
        </Button>
      </div>
    </form>
  )
}
