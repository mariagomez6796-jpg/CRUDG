"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Stethoscope, CheckCircle } from "lucide-react"

const mockDoctors = [
  {
    id: "1",
    name: "Dr. María García",
    specialty: "Cardiología",
    availableSlots: [
      { date: "2024-01-25", time: "10:00" },
      { date: "2024-01-25", time: "11:30" },
      { date: "2024-01-26", time: "09:00" },
    ],
  },
  {
    id: "2",
    name: "Dr. Carlos Ruiz",
    specialty: "Pediatría",
    availableSlots: [
      { date: "2024-01-25", time: "14:00" },
      { date: "2024-01-26", time: "10:30" },
      { date: "2024-01-27", time: "15:00" },
    ],
  },
  {
    id: "3",
    name: "Dra. Ana Martínez",
    specialty: "Dermatología",
    availableSlots: [
      { date: "2024-01-26", time: "11:00" },
      { date: "2024-01-27", time: "09:30" },
      { date: "2024-01-27", time: "16:00" },
    ],
  },
]

export function AppointmentBooking() {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null)
  const [reason, setReason] = useState("")
  const [isBooked, setIsBooked] = useState(false)

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

  const doctor = mockDoctors.find((d) => d.id === selectedDoctor)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Agendar Nueva Cita</h2>
        <p className="text-muted-foreground">Selecciona un médico y horario disponible para tu consulta</p>
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
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Paso 1: Selecciona un médico</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockDoctors.map((doc) => (
                <Card
                  key={doc.id}
                  className={`cursor-pointer transition-all ${
                    selectedDoctor === doc.id ? "ring-2 ring-primary" : "hover:border-primary"
                  }`}
                  onClick={() => {
                    setSelectedDoctor(doc.id)
                    setSelectedSlot(null)
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{doc.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      {doc.specialty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{doc.availableSlots.length} horarios disponibles</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedDoctor && doctor && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Paso 2: Selecciona un horario</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {doctor.availableSlots.map((slot, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all ${
                      selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:border-primary"
                    }`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{slot.date}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {slot.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {selectedSlot && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Paso 3: Motivo de la consulta</h3>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reason">Describe brevemente el motivo de tu consulta</Label>
                    <Textarea
                      id="reason"
                      placeholder="Ej: Dolor de cabeza recurrente, control de rutina, etc."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button className="w-full" onClick={handleBooking} disabled={!reason.trim()}>
                    Confirmar Cita
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}
