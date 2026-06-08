# Orienta

Orienta es una plataforma web para explorar carreras y profesiones compatibles con el perfil del usuario, evaluando sus intereses, habilidades y objetivos laborales mediante un test interactivo.

## Estructura del Proyecto

El proyecto está organizado de forma limpia y modular:

- **`/app`**: Aplicación Frontend construida con **Next.js** (App Router) y React.
- **`/backend`**: API REST del Backend construida con **FastAPI** (Python).
- **`/public`**: Archivos estáticos públicos (como el favicon).

La lógica de negocio (preguntas, ponderaciones, cálculo de perfiles y afinidad de carreras) reside completamente en el backend, que sirve como fuente de verdad. El frontend se comunica con él a través de endpoints API REST.

## Requisitos Previos

- **Node.js** v18+ y npm
- **Python** v3.10+

## Preparación del Entorno

### 1. Backend
El backend utiliza un entorno virtual de Python. Las dependencias ya vienen instaladas dentro de él:
- Las dependencias se encuentran en `backend/requirements.txt`.
- El entorno virtual está ubicado en `backend/.venv`.

### 2. Frontend
Instala las dependencias de Next.js desde la raíz del proyecto:
```bash
npm install
```

## Desarrollo

Para arrancar tanto el frontend como el backend de manera simultánea en modo de desarrollo, ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm run dev
```

Este comando utiliza `concurrently` para ejecutar en paralelo:
- **Next.js** en [http://localhost:3000](http://localhost:3000)
- **FastAPI** en [http://localhost:8000](http://localhost:8000) (con reload automático)

### Comandos individuales
Si prefieres ejecutarlos por separado en distintas terminales:

**Iniciar Frontend:**
```bash
npm run dev:frontend
```

**Iniciar Backend (Windows):**
```bash
npm run dev:backend
```
o manualmente:
```bash
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
