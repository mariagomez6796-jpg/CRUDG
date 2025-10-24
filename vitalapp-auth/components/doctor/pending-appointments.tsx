"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockAppointments = [
  {
    id: "1",
    patient: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: "+34 611 111 111",
    date: "2024-01-25",
    time: "10:00",
    reason: "Consulta de seguimiento - Hipertensión",
    status: "pending",
  },
  {
    id: "2",
    patient: "María López",
    email: "maria.lopez@email.com",
    phone: "+34 622 222 222",
    date: "2024-01-25",
    time: "11:30",
    reason: "Primera consulta - Dolor de cabeza recurrente",
    status: "pending",
  },
  {
    id: "3",
    patient: "Pedro Gómez",
    email: "pedro.gomez@email.com",
    phone: "+34 633 333 333",
    date: "2024-01-26",
    time: "09:00",
    reason: "Revisión de resultados de laboratorio",
    status: "confirmed",
  },
  {
    id: "4",
    patient: "Carmen Díaz",
    email: "carmen.diaz@email.com",
    phone: "+34 644 444 444",
    date: "2024-01-26",
    time: "14:00",
    reason: "Control mensual - Diabetes",
    status: "confirmed",
  },
]

const statusConfig = {
  pending: { label: "Pendiente", variant: "secondary" as const },
  confirmed: { label: "Confirmada", variant: "default" as const },
}

export function PendingAppointments() {
  const [appointments, setAppointments] = useState(mockAppointments)
  const { toast } = useToast()

  const handleConfirmAppointment = (appointmentId: string) => {
    setAppointments(appointments.map((apt) => (apt.id === appointmentId ? { ...apt, status: "confirmed" } : apt)))

    toast({
      title: "Cita confirmada",
      description: "La cita ha sido confirmada exitosamente.",
    })
  }

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== appointmentId))

    toast({
      title: "Cita cancelada",
      description: "La cita ha sido cancelada y eliminada.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Citas Pendientes</h2>
        <p className="text-muted-foreground">Gestiona y confirma las citas programadas con tus pacientes</p>
      </div>

      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{appointment.patient}</CardTitle>
                    <Badge variant={statusConfig[appointment.status as keyof typeof statusConfig].variant}>
                      {statusConfig[appointment.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <CardDescription>{appointment.reason}</CardDescription>
                </div>
                {appointment.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                      onClick={() => handleConfirmAppointment(appointment.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirmar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{appointment.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground col-span-1 sm:col-span-2 lg:col-span-2">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{appointment.email}</span>
                </div>
              </div>
              {appointment.status === "confirmed" && (
                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full sm:w-auto">
                    <User className="w-4 h-4 mr-2" />
                    Ver Historial del Paciente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
