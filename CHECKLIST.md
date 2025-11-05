# Checklist: Qué verificar antes de desplegar en Vercel

## ✅ Archivos de Configuración

- [x] `next.config.ts` - Configurado correctamente (sin next.config.mjs)
- [x] `package.json` - Script de build simplificado (`next build`)
- [x] `vercel.json` - Creado con configuración básica
- [x] `.gitignore` - Configurado correctamente

## ⚠️ Variables de Entorno Necesarias

Antes de desplegar en Vercel, configura estas variables de entorno en **Settings > Environment Variables**:

### Opcional pero Recomendado:
- [ ] `GOOGLE_GENAI_API_KEY` - Si usas Genkit en producción
  - Obtén tu API key de: https://aistudio.google.com/app/apikey
  - Sin esto, las funciones de Genkit no funcionarán en producción

### Firebase (Ya configurado en código):
- Firebase ya está configurado con valores hardcodeados en `src/firebase/config.ts`
- No necesitas variables de entorno para Firebase a menos que quieras usar diferentes credenciales

## 🔍 Verificaciones en Vercel

### 1. Configuración del Proyecto
- [ ] Framework detectado: Next.js
- [ ] Build Command: `npm run build` (o `next build`)
- [ ] Output Directory: `.next` (automático)
- [ ] Install Command: `npm install`

### 2. Repositorio Conectado
- [ ] Repositorio: `axyra-app/Doctor`
- [ ] Branch: `main`
- [ ] Permisos: Vercel tiene acceso al repositorio

### 3. Build Logs
Después del primer deployment, verifica:
- [ ] Build se completa sin errores
- [ ] No hay errores de módulos faltantes
- [ ] No hay errores de TypeScript (aunque están ignorados)
- [ ] Las dependencias se instalan correctamente

## 🐛 Problemas Comunes y Soluciones

### Error: "Module not found"
**Solución:**
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que `node_modules` esté en `.gitignore`

### Error: "Build failed" o "Command failed"
**Solución:**
- Revisa los logs completos en Vercel
- Verifica que el script de build sea correcto: `npm run build`
- Asegúrate de que no haya errores de sintaxis en el código

### Error: "Firebase initialization failed"
**Solución:**
- El código tiene fallback automático a `firebaseConfig`
- Verifica que las credenciales en `src/firebase/config.ts` sean correctas
- Revisa las reglas de Firestore en `firestore.rules`

### Error: "Genkit/GoogleAI API error"
**Solución:**
- Agrega `GOOGLE_GENAI_API_KEY` en las variables de entorno de Vercel
- Si no usas Genkit en producción, considera hacer que sea opcional

### Error: "Cannot find module '@genkit-ai/next'"
**Solución:**
- Verifica que todas las dependencias estén instaladas
- Ejecuta `npm install` localmente y verifica que no haya errores
- Asegúrate de que `package-lock.json` esté commitado

## 📝 Pasos Post-Deployment

Después de que el deployment sea exitoso:

1. [ ] Verifica que la página principal carga: `https://tu-proyecto.vercel.app`
2. [ ] Prueba la autenticación de Firebase
3. [ ] Verifica que las rutas funcionen correctamente
4. [ ] Si usas Genkit, prueba las funciones de AI
5. [ ] Verifica que las imágenes se carguen correctamente

## 🔗 Enlaces Útiles

- [Dashboard de Vercel](https://vercel.com/dashboard)
- [Documentación de Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Variables de Entorno en Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
- [Google AI Studio (para API Key)](https://aistudio.google.com/app/apikey)

## 📞 Si Aún Hay Problemas

Si después de verificar todo esto aún tienes errores:

1. Copia el mensaje de error completo de Vercel
2. Revisa los logs completos del build
3. Verifica que todos los archivos estén en GitHub
4. Asegúrate de que el repositorio esté actualizado

