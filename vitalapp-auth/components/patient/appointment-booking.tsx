"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Stethoscope, CheckCircle } from "lucide-react"
export function AppointmentBooking() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null)
  const [reason, setReason] = useState("")
  const [isBooked, setIsBooked] = useState(false)

  // 🔹 Obtener doctores desde el backend
  useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/doctor`)
      const data = await res.json()
      setDoctors(data)
    } catch (error) {
      console.error("Error al obtener los doctores:", error)
    }
  }

  fetchDoctors()
}, [])



  const handleBooking = () => {
    if (selectedDoctor && selectedSlot && reason) {
      setIsBooked(true)
      setTimeout(() => {
        setIsBooked(false)
        setSelectedDoctor(null)
        setSelectedSlot(null)
        setReason("")
      }, 3000)
    }
  }

  const doctor = doctors.find((d) => d.id === selectedDoctor)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Agendar Nueva Cita</h2>

        <p className="text-muted-foreground">Selecciona un médico para agendar tu consulta</p>

      </div>

      {isBooked ? (
        <Card className="border-green-600 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <div className="bg-green-600 rounded-full p-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">¡Cita Agendada!</h3>
                <p className="text-green-700">Tu cita ha sido confirmada exitosamente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>

          {/* 🔹 Paso 1: Seleccionar médico */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Paso 1: Selecciona un médico</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {doctors.length > 0 ? (
                doctors.map((doc) => (
                  <Card
                    key={doc.id}
                    className={`cursor-pointer transition-all ${
                      selectedDoctor === doc.id ? "ring-2 ring-primary" : "hover:border-primary"
                    }`}
                    onClick={() => setSelectedDoctor(doc.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{doc.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        {doc.specialty}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">Seleccionar</Badge>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">Cargando doctores...</p>
              )}
            </div>
          </div>

          {/* 🔹 Paso 2 y 3 los agregaremos después, cuando conectemos horarios */}
        </>
      )}
    </div>
  )
}
