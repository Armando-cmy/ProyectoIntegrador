# Global Car

El proyecto está separado en dos aplicaciones:

- `frontend/`: interfaz Next.js.
- `backend/`: API FastAPI.

## Preparación inicial

En la primera terminal, instala las dependencias del frontend:

```powershell
cd frontend
npm install
```

En otra terminal, prepara el backend:

```powershell
cd backend
python -m venv .venv
Copy-Item .env.example .env
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Edita `backend\.env` y completa la URL de Supabase, una clave secreta de servidor y un secreto JWT. No pongas la clave secreta en `frontend/` ni la compartas por chat.

## Iniciar el frontend

En una terminal, desde la raíz:

```powershell
cd frontend
npm run dev
```

Abre `http://localhost:3000`.

## Iniciar el backend

En otra terminal, desde la raíz:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

La API estará en `http://127.0.0.1:8000`; su documentación está en `/docs`.

El login usa las tablas propias descritas en [backend/README.md](./backend/README.md); no usa Supabase Auth.
