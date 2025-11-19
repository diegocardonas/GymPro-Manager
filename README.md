# 🏋️‍♂️ GymPro Manager

> **Forjando tu mejor versión.**

**GymPro Manager** es una plataforma integral de gestión de gimnasios moderna, receptiva y potenciada por Inteligencia Artificial. Diseñada para conectar administradores, entrenadores, personal operativo y clientes en un ecosistema unificado que mejora la eficiencia operativa y la experiencia del usuario.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?logo=google)

## ✨ Características Principales

### 🤖 Integración de Inteligencia Artificial (Google Gemini)
*   **Entrenador IA Personal:** Chatbot interactivo para responder dudas sobre fitness y salud en tiempo real.
*   **Análisis Nutricional:** Análisis automático de comidas basado en descripciones de texto, calculando macros y calorías estimadas.
*   **Generador de Rutinas:** Asistente para entrenadores que crea rutinas personalizadas basadas en el perfil biométrico del cliente.

### 👥 Roles y Paneles Específicos
La aplicación adapta su interfaz y funcionalidades según el rol del usuario:

1.  **Administrador:**
    *   Gestión CRUD completa de usuarios (Clientes, Entrenadores, Staff).
    *   Panel financiero y reportes con gráficos interactivos (Recharts).
    *   Gestión de inventario y reportes de incidencias de equipos.
    *   Configuración global, niveles de membresía y anuncios.
2.  **Cliente:**
    *   Visualización de rutinas interactivas y registro de entrenamientos (Log).
    *   Seguimiento de progreso con gráficos de volumen y fuerza.
    *   Reserva de clases y tarjeta de membresía digital.
    *   Gamificación (Logros y Desafíos).
3.  **Entrenador:**
    *   Gestión de cartera de clientes.
    *   Creación y asignación de plantillas de rutinas.
    *   Agenda de clases.
4.  **Personal Operativo y de Salud:**
    *   **Recepcionista:** Sistema de Check-In rápido y validación de acceso.
    *   **Gerente:** Visión general de métricas de negocio (KPIs, Ingresos).
    *   **Nutricionista:** Revisión de diarios de comida y asignación de planes.
    *   **Fisioterapeuta:** Gestión de pacientes y notas de progreso/lesiones.

### 🛠️ Funcionalidades Transversales
*   **Sistema de Mensajería:** Chat interno entre usuarios con soporte para bloqueo.
*   **Internacionalización (i18n):** Soporte completo para **Español** e **Inglés**.
*   **Tema Oscuro/Claro:** Persistencia de preferencias de apariencia.
*   **Diseño Responsivo:** Interfaz optimizada para móviles (Barra lateral colapsable/Drawer) y escritorio.

## 🚀 Tecnologías Utilizadas

*   **Frontend:** React 19, TypeScript.
*   **Estilos:** Tailwind CSS (Diseño utility-first).
*   **Estado:** React Context API + LocalStorage (Persistencia de datos simulada).
*   **IA:** `@google/genai` (Google Gemini API).
*   **Gráficos:** Recharts.
*   **Iconos:** Componentes SVG personalizados.
*   **Internacionalización:** `i18next`, `react-i18next`.

## 🔐 Credenciales de Demostración

Puedes utilizar las siguientes credenciales para explorar los diferentes roles del sistema. La contraseña para todos es `password123`.

| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| **Admin** | `admin@gympro.com` | `password123` |
| **Cliente** | `samantha.w@example.com` | `password123` |
| **Entrenador** | `chris.v@gympro.com` | `password123` |
| **Recepción** | `reception@gympro.com` | `password123` |
| **Nutricionista**| `nutrition@gympro.com` | `password123` |

> **Nota:** En la pantalla de inicio de sesión, hay botones de acceso rápido ("Demo Access") para rellenar estos datos automáticamente.

## 📦 Instalación y Uso

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/tu-usuario/gympro-manager.git
    cd gympro-manager
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    # o
    yarn install
    ```

3.  **Configurar Variables de Entorno**
    Crea un archivo `.env` en la raíz del proyecto y añade tu API Key de Google Gemini:
    ```env
    API_KEY=tu_api_key_de_google_gemini
    ```

4.  **Ejecutar el servidor de desarrollo**
    ```bash
    npm start
    # o el comando correspondiente a tu bundler (ej. npm run dev para Vite)
    ```

## 📂 Estructura del Proyecto

```text
/
├── components/         # Componentes de React
│   ├── admin/          # Vistas específicas de Administrador
│   ├── client/         # Vistas específicas de Cliente
│   ├── trainer/        # Vistas específicas de Entrenador
│   ├── icons/          # Iconos SVG
│   ├── shared/         # Modales y componentes reutilizables
│   └── ...             # Dashboards principales (AdminDashboard, ClientDashboard, etc.)
├── context/            # Context API (AuthContext, ThemeContext)
├── data/               # Datos simulados (Mock Data)
├── locales/            # Archivos de traducción (ES/EN)
├── types.ts            # Definiciones de tipos TypeScript
├── App.tsx             # Componente raíz y enrutamiento por roles
└── index.tsx           # Punto de entrada
```

## © Copyright

© 2024 GymPro Manager. Todos los derechos reservados.
