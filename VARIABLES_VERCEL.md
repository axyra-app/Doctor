# 🔑 Variables de Entorno para Vercel - DoctorAtHome

## 📋 Lista Completa de Variables

Copia y pega estas variables en **Vercel > Settings > Environment Variables**

---

## 🔥 Firebase (Recomendado - Opcional pero recomendado)

Aunque la app funciona sin estas variables (usa configuración hardcodeada), es mejor usar variables de entorno en producción:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBVQg-uVcWlaSAgHUlaBxWqkORvYuvED_A
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=doctor-d4d21.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=doctor-d4d21
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=doctor-d4d21.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=620338133959
NEXT_PUBLIC_FIREBASE_APP_ID=1:620338133959:web:95281d0ee7a0328f91f7e2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-5MS0QXRLLS
```

**Configuración en Vercel:**
- Ve a tu proyecto en Vercel
- **Settings > Environment Variables**
- Agrega cada variable una por una
- **Environments:** Marca todas (Production, Preview, Development)
- Click **Save** después de cada variable

---

## 🗺️ Mapbox API (NECESARIO)

**Variable:**
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu-token-de-mapbox
```

**Cómo obtenerla:**
1. Ve a [Mapbox Account](https://account.mapbox.com/)
2. Crea cuenta (gratis) o inicia sesión
3. Ve a [Access Tokens](https://account.mapbox.com/access-tokens/)
4. Copia tu **"Default public token"** (empieza con `pk.ey...`)

**Configuración en Vercel:**
- Key: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- Value: Tu Access Token de Mapbox
- Environments: Production, Preview, Development

---

## 🤖 Google AI (Genkit) - OPCIONAL

**Variable:**
```env
GOOGLE_GENAI_API_KEY=tu-api-key-de-google-ai
```

**Cómo obtenerla:**
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Create API Key**
3. Copia la API Key

**Configuración en Vercel:**
- Key: `GOOGLE_GENAI_API_KEY`
- Value: Tu API Key de Google AI
- Environments: Production, Preview, Development

---

## 📝 Resumen Rápido

### Variables OBLIGATORIAS:
- ✅ `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` (para mapas)

### Variables OPCIONALES pero RECOMENDADAS:
- 🔥 `NEXT_PUBLIC_FIREBASE_API_KEY` (y las otras 6 de Firebase)
- 🤖 `GOOGLE_GENAI_API_KEY` (para sugerencias IA)

---

## 🚀 Pasos para Configurar en Vercel

1. **Ve a tu proyecto en Vercel**
2. **Settings > Environment Variables**
3. **Add New** para cada variable
4. Copia el **Key** y **Value** de arriba
5. Marca todos los **Environments** (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** tu aplicación (Vercel > Deployments > ... > Redeploy)

---

## ✅ Verificación

Después de agregar las variables y hacer redeploy:

1. **Firebase:** La app debería conectarse correctamente
2. **Mapbox:** Ve a `/requests/new` - deberías ver el mapa de Mapbox
3. **Google AI:** Ve a `/suggest-doctors` - debería funcionar (si agregaste la key)

---

## 🆘 Problemas Comunes

### "Firebase: Need to provide options"
- Verifica que todas las variables de Firebase estén correctas
- Asegúrate de hacer redeploy después de agregar variables

### "Mapbox Access Token no configurado"
- Verifica que `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` esté en Vercel
- Asegúrate de hacer redeploy
- Verifica que el token sea público (empieza con `pk.`)

### Las variables no se aplican
- **Redeploy** es necesario después de agregar/modificar variables
- Verifica que las variables estén en el environment correcto (Production/Preview/Development)

---

**Nota:** Después de agregar/modificar variables, siempre haz un **Redeploy** en Vercel para que los cambios surtan efecto.

