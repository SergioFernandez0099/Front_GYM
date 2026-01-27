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
- Consultar historial de sesiones 

---

## ⚡ Tecnologías

- **Frontend**: Vite, Vanilla JS
- **Routing**: [Navigo](https://github.com/krasimir/navigo)
- **Autenticación**: JWT
- **Backend**: API propia (ver enlace más abajo)

---

## 🌐 Integración con Backend

Esta aplicación consume una API para la gestión de usuarios, rutinas y sets de entrenamiento.  
Repositorio del backend (código abierto): [Backend GitHub](https://github.com/SergioFernandez0099/Back_GYM)  

---

## 🛠 Instalación y Ejecución

### Requisitos
- Node.js
- npm
- pnpm

### Pasos
1. Clonar el repositorio:

```bash
git clone https://github.com/SergioFernandez0099/Front_GYM.git
cd tu-repo-frontend
```
2. Instalar dependencias:
```bash
pnpm install
```
3. Configurar la dirección de la API en la variable de entorno en un archivo .env:
```
VITE_API_BASE=/api
```
4. Hacer el build de la aplicación
```bash
pnpm run build
```
5. Puedes mostrar una preview de al app con este comando
```bash
pnpm run preview
```

## 🚀 Pruébala tú mismo

¿Quieres ver la aplicación en acción?  
Puedes acceder a la Web App y probar todas sus características.

👉 **Accede aquí:**  
🌐 https://sergiof.es/

### 🔑 Credenciales de prueba
Para facilitar el acceso, puedes usar las siguientes credenciales genéricas:

- **Usuario:** carlos
- **Contraseña:** 1234

> Estas credenciales son solo para pruebas y no contienen información real.

## 📖 Licencia
Este proyecto es open source. Revisa el archivo `LICENSE` para más detalles.

## 🔗 Enlaces Útiles

- [Repositorio del Backend](https://github.com/SergioFernandez0099/Back_GYM)

