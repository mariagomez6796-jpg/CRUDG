# Videocalls API (FastAPI + WebSocket + JWT) — **sin frontend aparte**

¡Listo para usar! Esta API deja solo lo necesario para **videollamadas** con señalización WebSocket y
un **mini HTML** embebido (en `/static/index.html`) que **solo** te pide el **token** y el **código de sala**.
Así desconectamos el front anterior y queda la **pura API** funcionando.

## Qué incluye
- FastAPI con endpoints:
  - `POST /auth/login` → genera un JWT (usuario/clave vienen del `.env`).
  - `POST /rooms` (Bearer) → crea una sala y devuelve `code`.
  - `GET /rooms/{code}` (Bearer) → consulta la sala.
  - `DELETE /rooms/{code}` (Bearer) → elimina la sala.
  - `WS /ws/{code}?token=...` → señalización WebRTC (relay de offer/answer/ice).
- JWT simple (PyJWT). También puedes pegar un token externo si ya lo emites desde otro servicio.
- MySQL (8.0) con tablas básicas `rooms`, `participants`, `call_logs`.
- `docker-compose.yml` con:
  - `videoapi` (este servicio),
  - `db` (MySQL),
  - `adminer` (UI en `http://localhost:8080`).
- Página mínima para probar en `http://localhost:8000/static/index.html` (pide token y sala).

## Levantar en Docker
```bash
cp .env.example .env   # ajusta secretos y credenciales si quieres
docker compose up -d --build
```
API: `http://localhost:8000`  
Docs: `http://localhost:8000/docs`  
Adminer: `http://localhost:8080` (Server: db, User: app, Pass: app, DB: videocalls)

## Flujo rápido de prueba
1) Genera token (opcional):
```bash
curl -s -X POST http://localhost:8000/auth/login -H "Content-Type: application/json"       -d '{"username":"admin","password":"admin123"}'
```
Copia `access_token` del JSON.

2) Crea sala (requiere Bearer):
```bash
export TOKEN=pega_aqui_tu_token
curl -s -X POST http://localhost:8000/rooms -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{}'
# -> {"code":"abc123", ...}
```

3) Abre `http://localhost:8000/static/index.html` en **dos** pestañas o dispositivos.  
   - Pega el **token** y el **código de sala** en ambas.  
   - Dale **Iniciar cámara** y luego **Conectar a la sala**.  
   - Listo: WebRTC P2P usando este backend solo como señalización.

> Nota: Este server **no** mezcla ni transcodifica audio/video; solo hace la **señalización**.
> La media viaja directamente entre navegadores (P2P) usando ICE/SDP.

## Mantener tu base de datos
- El `docker-compose.yml` crea la base `videocalls` con usuario `app/app`.  
- Si ya tienes una base de *videollamada* existente, ajusta los valores de `.env` (`DB_HOST`, `DB_NAME`, etc.) para apuntar a la tuya.
- En `startup` se crean las tablas si no existen, sin borrar las tuyas.

## Seguridad
- Cambia `JWT_SECRET` en `.env`.
- En producción, restringe CORS y sirve detrás de HTTPS (requerido para getUserMedia).

## Sin el front anterior
- Eliminamos dependencias de UI y dejamos `/static/index.html` solo para probar/operar la llamada pegando **token** y **sala**.
- Si no quieres **nada** de HTML, borra la carpeta `app/static` y el `app.mount("/static", ...)` de `main.py`.

---
Hecho para que pegues tus propios emisores de token o uses `/auth/login` temporalmente.
