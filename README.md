# Web App de Gestión de Sesiones de Entrenamiento

¡Bienvenido a la Web App de Gestión de Sesiones de Entrenamiento!  
Esta aplicación permite a los usuarios gestionar sus rutinas de entrenamiento, registrar sets y repeticiones, y consultar ejercicios de manera sencilla.

---

## 🏋️ Funcionalidades Principales

- Consultar ejercicios disponibles.
- Crear rutinas personalizadas por usuario (por ejemplo: Torso 1, Torso 2, Pierna 1, Pierna 2).
- Añadir sets de ejercicios a cada rutina con:
  - Número de series
  - Número de repeticiones por serie
  - Peso utilizado
  - Descripción opcional
- Registrar los resultados durante el entrenamiento:
  - Ejemplo: en el día Torso 1, ejercicio Press de Banca:
    - Serie 1: 100 kg, 2 repeticiones
    - Serie 2: 90 kg, 8 repeticiones
    - Serie 3: 90 kg, 8 repeticiones

---

## ⚡ Tecnologías

- **Frontend**: Vite, Vanilla JS
- **Routing**: [Navigo](https://github.com/krasimir/navigo)
- **Autenticación**: JWT
- **Backend**: API propia (ver enlace más abajo)

---

## 🌐 Integración con Backend

Esta aplicación consume una API de backend para la gestión de usuarios, rutinas y sets de entrenamiento.  
Repositorio del backend (código abierto): [Backend GitHub](https://github.com/tu-usuario/tu-backend-repo)  

---

## 🛠 Instalación y Ejecución

### Requisitos
- Node.js (v14 o superior)
- npm (v6 o superior)

### Pasos
1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repo-frontend.git
cd tu-repo-frontend
```
2. Instalar dependencias:
```bash
npm install
```
3. Ejecutar la apliación
```bash
npm run dev
```
4. Abrir en tu navegador
`http://localhost:5173`

## 🗂 Estructura del Proyecto

```bash
src/             # Código fuente principal
  components/    # Componentes UI reutilizables
  pages/         # Vistas de la aplicación
  api/           # Funciones para consumir la API
index.html       # Entrada principal
vite.config.js   # Configuración de Vite
```

## 📖 Licencia
Este proyecto es open source. Revisa el archivo `LICENSE` para más detalles.

## 🔗 Enlaces Útiles

- [Repositorio del Backend](https://github.com/tu-usuario/tu-backend-repo)

