# Orienta

Orienta es una plataforma web para explorar carreras y profesiones compatibles con el perfil del usuario. Su objetivo principal es evaluar intereses, habilidades y objetivos laborales mediante un test interactivo para ofrecer recomendaciones de carrera personalizadas.

El proyecto está diseñado de forma modular y se encuentra en activo desarrollo, por lo que su estructura y funcionalidades actuales están abiertas a posibles cambios, expansiones y mejoras en el futuro.

## Funcionamiento Actual de la Aplicación

En este momento, la plataforma opera bajo una arquitectura cliente-servidor dividida en dos componentes principales que se comunican a través de una API REST:

### 1. Backend (FastAPI - Python)
El backend (`/backend`) actúa como el núcleo lógico y de procesamiento de la aplicación. Es la fuente de la verdad para el cálculo de perfiles y la información de carreras. Sus módulos principales implementados hasta ahora son:

- **Motor de Emparejamiento (Matching):** Un sistema (`services/matching.py`) que evalúa las características del usuario (intereses, habilidades, objetivos) para calcular el porcentaje de afinidad con diferentes carreras.
- **Catálogo de Carreras:** Endpoints (`api/v1/endpoints/careers.py`) dedicados para proporcionar la lista de profesiones y el detalle de cada una de ellas.
- **Inteligencia Artificial (LLMs):** Cuenta con integraciones iniciales con modelos de lenguaje (como Gemini) para enriquecer dinámicamente el contenido de las profesiones, analizar perfiles de manera inteligente y brindar recomendaciones precisas.
- **Datos del Mercado Laboral:** Módulos (`services/market_data.py`) preparados para procesar información del mundo real sobre la demanda, salarios y proyecciones de las distintas profesiones.
- **Base de Datos:** Almacena la información de manera estructurada y persistente utilizando **PostgreSQL** alojado en la nube (Neon), garantizando que los datos no se pierdan en producción. Cuenta con opción de fallback a SQLite para desarrollo local rápido.

### 2. Frontend (Next.js - React)
La interfaz de usuario (`/app`) está construida utilizando el marco moderno de **Next.js (App Router)**. Su función es consumir la información estructurada del backend y presentarla al usuario mediante interfaces interactivas, como la visualización detallada de las carreras y, próximamente, el flujo completo del test de orientación.

## Requisitos Previos

- **Node.js** (v18+) y npm
- **Python** (v3.10+)

## Preparación y Ejecución del Entorno

El proyecto está configurado para que puedas arrancar ambos entornos simultáneamente de forma sencilla.

### Instalación
1. El **backend** cuenta con un entorno virtual local (`.venv`) y las dependencias están listadas en `backend/requirements.txt`. (Asegúrate de instalarlas si ejecutas el backend por primera vez de forma aislada).
2. Para el **frontend**, instala las dependencias de Node en la raíz del proyecto ejecutando:
   ```bash
   npm install
   ```

### Ejecución Local
Para levantar tanto el Frontend como el Backend a la vez en modo desarrollo, ejecuta en la raíz del proyecto:

```bash
npm run dev
```

Este comando levanta:
- **Frontend (Next.js):** Disponible en [http://localhost:3000](http://localhost:3000)
- **Backend (FastAPI):** Disponible en [http://localhost:8000](http://localhost:8000) (con recarga automática ante cambios)

### Ejecución Individual
Si necesitas ejecutar los servicios por separado:
- **Frontend:** `npm run dev:frontend`
- **Backend:** `npm run dev:backend` (en Windows)

## Evolución del Proyecto

Al estar abierto a cambios, los próximos pasos involucrarán la conexión de los componentes visuales del test con la API del backend, el ajuste de los algoritmos de recomendación usando IA y la mejora continua en la experiencia de usuario.
