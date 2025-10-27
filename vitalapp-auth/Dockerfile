# Etapa 1: Construcción
FROM node:18-bullseye AS builder

WORKDIR /app

# Variables públicas para build (incrustadas en el bundle)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_VIDEO_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_VIDEO_API_URL=${NEXT_PUBLIC_VIDEO_API_URL}

# Copiar dependencias
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Instalar dependencias (puede usar npm o pnpm, ajusta según tu proyecto)
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la app de Next.js
RUN npm run build

# Etapa 2: Servir la app
FROM node:18-bullseye

WORKDIR /app

# Copiar archivos de la build
COPY --from=builder /app ./

# Exponer el puerto
EXPOSE 3000

# Iniciar la app
CMD ["npm", "start"]
