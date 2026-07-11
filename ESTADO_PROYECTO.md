# Estado del Proyecto: Orienta

Este documento es un resumen "vivo" del progreso del desarrollo, la arquitectura y las funcionalidades implementadas hasta la fecha. Sirve como registro de avance y documentación de referencia rápida.

## 1. Arquitectura General

El proyecto está dividido en dos partes principales que se comunican a través de una API REST:

*   **Frontend (Next.js con App Router):** Interfaz de usuario interactiva y moderna.
*   **Backend (FastAPI - Python):** Núcleo de la lógica de negocio, cálculos y manejo de base de datos.
*   **Base de Datos:** **PostgreSQL** (alojado en la nube con Neon) para persistencia total de datos en producción, con soporte de fallback a SQLite (`orienta.db`) para desarrollo local.

## 2. Funcionalidades y Módulos Implementados

### Backend (Lógica y API)
El backend cuenta con una estructura robusta y escalable (`/backend/app`):

*   **Motor de Emparejamiento (Matching):**
    *   `services/matching.py` y `api/v1/endpoints/matching.py`: Contienen la lógica para evaluar los intereses, habilidades y objetivos de un usuario y calcular el porcentaje de afinidad con diversas carreras profesionales.
*   **Gestión de Carreras:**
    *   `api/v1/endpoints/careers.py`: Endpoints para obtener el catálogo de carreras y sus detalles.
*   **Inteligencia Artificial (Gemini / LLMs):**
    *   Se han creado integraciones y pruebas (`test_gemini.py`, `test_groq_update.py`, `test_ai.py`) para enriquecer dinámicamente la información, generar recomendaciones personalizadas y analizar perfiles usando IA.
*   **Datos del Mercado Laboral:**
    *   `services/market_data.py`: Módulo preparado para manejar información sobre demanda, salarios y proyecciones de cada profesión.
*   **Gestión de Datos (Scripts):**
    *   Se dispone de scripts para popular la base de datos (`seed_db.py`, `update_careers.py`) y gestionar administradores (`seed_admin.py`).

### Frontend
*   Estructura inicial configurada.
*   Entorno preparado para ejecutar frontend y backend de manera simultánea con un solo comando (`npm run dev`).

## 3. Próximos Pasos Sugeridos

1.  **Refinar la Interfaz de Usuario (UI):** Conectar los componentes visuales en Next.js con los endpoints ya desarrollados en el backend.
2.  **Flujo del Test:** Implementar el test interactivo en el frontend para que envíe las respuestas al servicio de *matching* y muestre los resultados.
3.  **Ajustes de Prompts (IA):** Seguir afinando los prompts de Gemini para asegurar que las descripciones y recomendaciones tengan el tono perfecto.

---
*Última actualización: Julio 2026*
