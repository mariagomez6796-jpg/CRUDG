"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Stethoscope, MapPin } from "lucide-react"

const mockAppointments = [
  {
    id: "1",
    patient: "Juan Pérez",
    doctor: "Dr. María García",
    specialty: "Cardiología",
    date: "2024-01-25",
    time: "10:00",
    status: "confirmed",
    location: "Consultorio 201",
  },
  {
    id: "2",
    patient: "María López",
    doctor: "Dr. Carlos Ruiz",
    specialty: "Pediatría",
    date: "2024-01-25",
    time: "11:30",
    status: "pending",
    location: "Consultorio 105",
  },
  {
    id: "3",
    patient: "Pedro Gómez",
    doctor: "Dra. Ana Martínez",
    specialty: "Dermatología",
    date: "2024-01-26",
    time: "09:00",
    status: "confirmed",
    location: "Consultorio 302",
  },
  {
    id: "4",
    patient: "Carmen Díaz",
    doctor: "Dr. María García",
    specialty: "Cardiología",
    date: "2024-01-26",
    time: "14:00",
    status: "completed",
    location: "Consultorio 201",
  },
  {
    id: "5",
    patient: "Luis Fernández",
    doctor: "Dr. Carlos Ruiz",
    specialty: "Pediatría",
    date: "2024-01-27",
    time: "10:30",
    status: "confirmed",
    location: "Consultorio 105",
  },
]

const statusConfig = {
  confirmed: { label: "Confirmada", variant: "default" as const },
  pending: { label: "Pendiente", variant: "secondary" as const },
  completed: { label: "Completada", variant: "outline" as const },
}

export function AppointmentsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Citas Disponibles</h2>
        <p className="text-muted-foreground">Vista general de todas las citas programadas en el sistema</p>
      </div>

      <div className="grid gap-4">
        {mockAppointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{appointment.patient}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    {appointment.doctor} - {appointment.specialty}
                  </CardDescription>
                </div>
                <Badge variant={statusConfig[appointment.status as keyof typeof statusConfig].variant}>
                  {statusConfig[appointment.status as keyof typeof statusConfig].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{appointment.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
