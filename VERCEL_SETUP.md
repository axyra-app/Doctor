# Configuración de Vercel - Guía de Setup

## Cambios realizados en el proyecto

1. ✅ **Eliminado conflicto de configuración**: Se eliminó `next.config.mjs` y se consolidó toda la configuración en `next.config.ts`
2. ✅ **Simplificado script de build**: El script de build ahora usa el comando estándar de Next.js (`next build`)
3. ✅ **Creado archivo vercel.json**: Configuración mínima para Vercel

## Pasos para conectar tu proyecto con Vercel

### 1. Subir cambios a GitHub

Primero, asegúrate de hacer commit y push de todos los cambios:

```bash
git add .
git commit -m "Fix: Configuración para Vercel"
git push origin main
```

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) y inicia sesión
2. Haz clic en "Add New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Next.js

### 3. Configurar Variables de Entorno

En la configuración del proyecto en Vercel, ve a **Settings > Environment Variables** y agrega las siguientes variables si las necesitas:

#### Firebase (si usas variables de entorno en lugar de config hardcodeado):
- `NEXT_PUBLIC_FIREBASE_API_KEY` (opcional, ya tienes la config en `src/firebase/config.ts`)
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` (opcional)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (opcional)

#### Google AI / Genkit (si usas Genkit en producción):
- `GOOGLE_GENAI_API_KEY` - Tu API key de Google AI para Genkit

### 4. Configuración de Build

Vercel debería detectar automáticamente:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (o `next build`)
- **Output Directory**: `.next` (automático)
- **Install Command**: `npm install`

### 5. Desplegar

1. Haz clic en "Deploy"
2. Espera a que termine el build
3. Si hay errores, revisa los logs en la consola de Vercel

## Solución de problemas comunes

### Error: "Module not found"
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que `node_modules` esté en `.gitignore`

### Error: "Build failed"
- Revisa los logs de build en Vercel
- Verifica que no haya errores de TypeScript (aunque están ignorados en build)
- Asegúrate de que todas las rutas de importación sean correctas

### Error: "Firebase initialization failed"
- Verifica que las credenciales de Firebase estén correctas
- El código tiene un fallback a `firebaseConfig`, así que debería funcionar

### Error relacionado con Genkit
- Si no usas Genkit en producción, puedes ignorar errores relacionados
- Si lo usas, asegúrate de configurar `GOOGLE_GENAI_API_KEY` en las variables de entorno

## Notas importantes

- El proyecto usa Next.js 15.3.3 con App Router
- Firebase está configurado para funcionar tanto en desarrollo como en producción
- Genkit está configurado pero puede requerir variables de entorno adicionales en producción
- El build ignora errores de TypeScript y ESLint para facilitar el despliegue

## Verificación post-deployment

Después del despliegue, verifica:
1. ✅ La página principal carga correctamente
2. ✅ Firebase se inicializa sin errores
3. ✅ Las rutas de autenticación funcionan
4. ✅ Las funciones de Genkit (si se usan) están disponibles


