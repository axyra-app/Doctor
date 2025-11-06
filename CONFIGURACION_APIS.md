# 🔑 Configuración de APIs - DoctorAtHome

## 📋 APIs Requeridas

Este proyecto necesita **3 APIs** configuradas. Sigue este paso a paso para obtenerlas y configurarlas.

---

## 1️⃣ Firebase (Ya Configurado ✅)

### Estado: ✅ Ya tienes Firebase configurado

**Proyecto:** `doctor-d4d21`

**Variables de Entorno para Vercel:**

Agrega estas variables en **Vercel > Settings > Environment Variables**:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBVQg-uVcWlaSAgHUlaBxWqkORvYuvED_A
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=doctor-d4d21.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=doctor-d4d21
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=doctor-d4d21.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=620338133959
NEXT_PUBLIC_FIREBASE_APP_ID=1:620338133959:web:95281d0ee7a0328f91f7e2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-5MS0QXRLLS
```

**Configuración:**
- Ya está configurado en `src/firebase/config.ts`
- Las variables de entorno son opcionales (hay fallback a la configuración hardcodeada)
- Se recomienda usar variables de entorno en producción para mayor flexibilidad

---

## 2️⃣ Mapbox API (NECESARIO)

### ¿Para qué sirve?
- Mostrar mapas interactivos
- Seleccionar ubicación de pacientes
- Ver solicitudes en mapa
- Calcular distancias

### Paso 1: Obtener Access Token

1. **Ve a Mapbox:**
   ```
   https://account.mapbox.com/
   ```

2. **Crea cuenta (gratis):**
   - Haz clic en **"Sign up"** o **"Iniciar sesión"** si ya tienes cuenta
   - Crea cuenta con tu email

3. **Obtén tu Access Token:**
   - Ve a: **https://account.mapbox.com/access-tokens/**
   - Verás tu **"Default public token"** (token público por defecto)
   - **Copia el token** (empieza con `pk.ey...`)

### Paso 2: Configurar en el Proyecto

**Archivo:** `.env.local` (crea este archivo en la raíz del proyecto)

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu-token-aqui
```

**Ejemplo:**
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example
```

### Paso 3: Configurar en Vercel (Producción)

1. Ve a tu proyecto en **Vercel**
2. **Settings > Environment Variables**
3. Agrega:
   - **Key:** `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
   - **Value:** Tu Access Token de Mapbox
   - **Environments:** Production, Preview, Development
4. Click **Save**
5. **Redeploy** tu aplicación

### Costos:
- **Gratis:** 50,000 cargas de mapa/mes
- **Luego:** $5 por 1,000 cargas adicionales

---

## 3️⃣ Google AI (Genkit) - OPCIONAL

### ¿Para qué sirve?
- Sugerencias inteligentes de doctores
- IA generativa para matching

### Paso 1: Obtener API Key

1. **Ve a Google AI Studio:**
   ```
   https://makersuite.google.com/app/apikey
   ```
   O
   ```
   https://aistudio.google.com/app/apikey
   ```

2. **Crea una API Key:**
   - Click en **Create API Key**
   - Selecciona tu proyecto de Google Cloud
   - Copia tu API Key

### Paso 2: Configurar en el Proyecto

**Archivo:** `.env.local`

```env
GOOGLE_GENAI_API_KEY=tu-api-key-aqui
```

**Ejemplo:**
```env
GOOGLE_GENAI_API_KEY=AIzaSy...
```

### Paso 3: Configurar en Vercel (Producción)

1. Ve a **Vercel > Settings > Environment Variables**
2. Agrega:
   - **Key:** `GOOGLE_GENAI_API_KEY`
   - **Value:** Tu API Key de Google AI
   - **Environments:** Production, Preview, Development
3. Click **Save**
4. **Redeploy**

### Costos:
- **Gratis:** Primeros 15 solicitudes/minuto
- **Luego:** Consulta precios en Google AI Studio

---

## 📝 Resumen de Variables de Entorno

### Archivo `.env.local` (local):

```env
# Mapbox API (NECESARIO)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu-token-aqui

# Google AI Genkit (OPCIONAL - para sugerencias IA)
GOOGLE_GENAI_API_KEY=tu-api-key-aqui
```

### Variables en Vercel:

**Firebase (Recomendado):**
1. `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API Key
2. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase Auth Domain
3. `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase Project ID
4. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase Storage Bucket
5. `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase Messaging Sender ID
6. `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase App ID
7. `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` - Firebase Measurement ID (Analytics)

**Mapbox (NECESARIO):**
8. `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` - Mapbox Access Token

**Google AI (OPCIONAL):**
9. `GOOGLE_GENAI_API_KEY` - Google AI API Key (opcional)

---

## ✅ Verificación

### Mapbox:
1. Abre la aplicación en `http://localhost:9002`
2. Ve a `/requests/new` (nueva solicitud)
3. Deberías ver un mapa interactivo de Mapbox
4. Si no aparece, revisa la consola del navegador por errores

### Google AI:
1. Ve a `/suggest-doctors`
2. Completa el formulario
3. Debería generar sugerencias
4. Si no funciona, la app seguirá funcionando sin IA

---

## 🆘 Solución de Problemas

### Error: "Mapbox Access Token no configurado"
- Verifica que `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` esté en `.env.local`
- Reinicia el servidor: `npm run dev`
- Verifica que el token esté correcto

### Error: "Invalid token"
- Verifica que copiaste el token completo
- Asegúrate de que es el token **público** (Default public token)
- No uses tokens secretos

### El mapa no aparece
- Verifica que el token esté correcto
- Revisa la consola del navegador (F12) para ver errores
- Asegúrate de que el token sea público (empieza con `pk.`)

---

## 📚 Enlaces Útiles

- **Mapbox Account:** https://account.mapbox.com/
- **Mapbox Access Tokens:** https://account.mapbox.com/access-tokens/
- **Mapbox Documentation:** https://docs.mapbox.com/
- **Google AI Studio:** https://aistudio.google.com/
- **Vercel Environment Variables:** Tu proyecto > Settings > Environment Variables

---

## 🎯 Checklist

- [ ] Mapbox cuenta creada
- [ ] Mapbox Access Token obtenido
- [ ] Token agregado a `.env.local`
- [ ] Token agregado a Vercel
- [ ] Mapa funciona en `/requests/new`
- [ ] (Opcional) Google AI API Key obtenida
- [ ] (Opcional) Google AI agregada a `.env.local` y Vercel

---

**Nota:** Sin Mapbox Access Token, las funcionalidades de mapas no funcionarán. Sin Google AI, las sugerencias inteligentes no estarán disponibles, pero el resto de la app funcionará normalmente.


