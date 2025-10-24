"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Stethoscope, MapPin, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockAppointments = [
  {
    id: "1",
    doctor: "Dr. María García",
    specialty: "Cardiología",
    date: "2024-01-25",
    time: "10:00",
    location: "Consultorio 201",
    reason: "Control de presión arterial",
    status: "confirmed",
  },
  {
    id: "2",
    doctor: "Dr. Carlos Ruiz",
    specialty: "Pediatría",
    date: "2024-01-26",
    time: "14:00",
    location: "Consultorio 105",
    reason: "Revisión general",
    status: "pending",
  },
  {
    id: "3",
    doctor: "Dra. Ana Martínez",
    specialty: "Dermatología",
    date: "2024-01-15",
    time: "11:00",
    location: "Consultorio 302",
    reason: "Consulta por manchas en la piel",
    status: "completed",
  },
]

const statusConfig = {
  confirmed: { label: "Confirmada", variant: "default" as const },
  pending: { label: "Pendiente", variant: "secondary" as const },
  completed: { label: "Completada", variant: "outline" as const },
  cancelled: { label: "Cancelada", variant: "destructive" as const },
}

export function MyAppointments() {
  const [appointments, setAppointments] = useState(mockAppointments)
  const { toast } = useToast()

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(appointments.map((apt) => (apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt)))

    toast({
      title: "Cita cancelada",
      description: "Tu cita ha sido cancelada exitosamente.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Mis Citas</h2>
        <p className="text-muted-foreground">Consulta y gestiona tus citas médicas programadas</p>
      </div>

      <div className="grid gap-4">
        {appointments
          .filter((apt) => apt.status !== "cancelled")
          .map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{appointment.doctor}</CardTitle>
                      <Badge variant={statusConfig[appointment.status as keyof typeof statusConfig].variant}>
                        {statusConfig[appointment.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      {appointment.specialty}
                    </CardDescription>
                  </div>
                  {appointment.status !== "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground col-span-1 sm:col-span-2">
                    <MapPin className="w-4 h-4" />
                    <span>{appointment.location}</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Motivo:</span> {appointment.reason}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
