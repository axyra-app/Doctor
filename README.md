# 🏥 DoctorAtHome

Plataforma de atención médica a domicilio estilo Uber/Indrive. Conecta pacientes con doctores cercanos en tiempo real.

## 🚀 Inicio Rápido

1. **Instala dependencias:**
   ```bash
   npm install
   ```

2. **Configura las APIs:**
   - Lee `CONFIGURACION_APIS.md` para obtener y configurar las API keys necesarias
   - Crea un archivo `.env.local` con las variables de entorno

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abre en el navegador:**
   ```
   http://localhost:9002
   ```

## 📚 Documentación

- **`CONFIGURACION_APIS.md`** - Guía completa para configurar todas las APIs necesarias
- **`docs/blueprint.md`** - Especificaciones del proyecto

## 🛠️ Tecnologías

- **Next.js 15** - Framework React
- **Firebase** - Autenticación y base de datos
- **Mapbox** - Mapas y geolocalización
- **Google AI (Genkit)** - Sugerencias inteligentes
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Shadcn/ui** - Componentes UI

## 📋 Funcionalidades

- ✅ Landing page profesional y atractiva
- ✅ Autenticación de usuarios (pacientes y doctores)
- ✅ Sistema de solicitudes de atención médica
- ✅ Geolocalización y mapas interactivos (Mapbox)
- ✅ Disponibilidad online/offline para doctores
- ✅ Perfiles mejorados con especialidades y certificaciones
- ✅ Sistema de urgencias (baja, media, alta, emergencia)
- ✅ Tracking en tiempo real del doctor (estilo Indrive/Uber) con ruta real
- ✅ Sistema de chat en tiempo real entre paciente y doctor
- ✅ Sistema completo de calificaciones y reseñas
- 🔄 Notificaciones en tiempo real (Firebase Cloud Messaging)
- 🔄 Sistema de pagos integrado (Stripe/PayPal)
- 🔄 Filtros y búsqueda avanzada

## 🔑 APIs Requeridas

Ver `CONFIGURACION_APIS.md` para detalles completos:

1. **Firebase** - Ya configurado ✅
2. **Mapbox** - Necesario para mapas (gratis, fácil de obtener)
3. **Google AI API** - Opcional, para sugerencias IA

## 📦 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter
- `npm run typecheck` - Verificación de tipos

## 🚀 Deploy

El proyecto está configurado para Vercel. Asegúrate de configurar las variables de entorno en Vercel antes del deploy.

Ver `CONFIGURACION_APIS.md` para las variables necesarias.

