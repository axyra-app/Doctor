# 🔑 Configuración de APIs - DoctorAtHome

## 📋 APIs Requeridas

Este proyecto necesita **3 APIs** configuradas. Sigue este paso a paso para obtenerlas y configurarlas.

---

## 1️⃣ Firebase (Ya Configurado ✅)

### Estado: ✅ Ya tienes Firebase configurado

**Proyecto:** `doctor-d1522`

**No necesitas hacer nada** - Ya está configurado en:
- `src/firebase/config.ts`
- Firebase Console

---

## 2️⃣ Google Maps API (NECESARIO)

### ¿Para qué sirve?
- Mostrar mapas interactivos
- Seleccionar ubicación de pacientes
- Ver solicitudes en mapa
- Calcular distancias

### Paso 1: Obtener API Key

1. **Ve a Google Cloud Console:**
   ```
   https://console.cloud.google.com/
   ```

2. **Crea o selecciona un proyecto:**
   - Si no tienes proyecto, crea uno nuevo
   - Nombre sugerido: "DoctorAtHome"

3. **Habilita las APIs necesarias:**
   - Ve a **APIs & Services > Library**
   - Busca y habilita:
     - ✅ **Maps JavaScript API**
     - ✅ **Geocoding API**
   - (Opcional) **Places API** (para autocompletado futuro)

4. **Crea una API Key:**
   - Ve a **APIs & Services > Credentials**
   - Click en **Create Credentials > API Key**
   - Copia tu API Key (ej: `AIzaSy...`)

5. **Configura restricciones (Recomendado):**
   - Click en tu API Key recién creada
   - En **Application restrictions:**
     - Selecciona **HTTP referrers (web sites)**
     - Agrega:
       - `http://localhost:9002/*` (desarrollo)
       - `https://tu-dominio.vercel.app/*` (producción)
   - En **API restrictions:**
     - Selecciona **Restrict key**
     - Marca solo: Maps JavaScript API y Geocoding API
   - Click **Save**

### Paso 2: Configurar en el Proyecto

**Archivo:** `.env.local` (crea este archivo en la raíz del proyecto)

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu-api-key-aqui
```

**Ejemplo:**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDoucdPhIOMY8W2psJQ0ttd7uy_gx7E1xM
```

### Paso 3: Configurar en Vercel (Producción)

1. Ve a tu proyecto en **Vercel**
2. **Settings > Environment Variables**
3. Agrega:
   - **Key:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value:** Tu API Key de Google Maps
   - **Environments:** Production, Preview, Development
4. Click **Save**
5. **Redeploy** tu aplicación

### Costos:
- **Gratis:** Primeros 28,000 cargas de mapa/mes
- **Luego:** $7 por 1,000 cargas adicionales

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
# Google Maps API (NECESARIO)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu-api-key-aqui

# Google AI Genkit (OPCIONAL - para sugerencias IA)
GOOGLE_GENAI_API_KEY=tu-api-key-aqui
```

### Variables en Vercel:

1. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API Key
2. `GOOGLE_GENAI_API_KEY` - Google AI API Key (opcional)

---

## ✅ Verificación

### Google Maps:
1. Abre la aplicación en `http://localhost:9002`
2. Ve a `/requests/new` (nueva solicitud)
3. Deberías ver un mapa interactivo
4. Si no aparece, revisa la consola del navegador por errores

### Google AI:
1. Ve a `/suggest-doctors`
2. Completa el formulario
3. Debería generar sugerencias
4. Si no funciona, la app seguirá funcionando sin IA

---

## 🆘 Solución de Problemas

### Error: "Google Maps API key not found"
- Verifica que `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` esté en `.env.local`
- Reinicia el servidor: `npm run dev`
- Verifica que la API Key esté correcta

### Error: "This API project is not authorized"
- Verifica que las APIs estén habilitadas en Google Cloud Console
- Verifica las restricciones de la API Key

### Error: "RefererNotAllowedMapError"
- Agrega tu dominio a las restricciones HTTP referrers
- Para desarrollo local: `http://localhost:9002/*`

### Error: "Billing not enabled"
- Google Maps requiere facturación habilitada
- Ve a Google Cloud Console > Billing
- Asocia una cuenta de facturación (tienes créditos gratis)

---

## 📚 Enlaces Útiles

- **Google Cloud Console:** https://console.cloud.google.com/
- **Google Maps Platform:** https://developers.google.com/maps
- **Google AI Studio:** https://aistudio.google.com/
- **Vercel Environment Variables:** Tu proyecto > Settings > Environment Variables

---

## 🎯 Checklist

- [ ] Google Maps API Key obtenida
- [ ] Maps JavaScript API habilitada
- [ ] Geocoding API habilitada
- [ ] API Key agregada a `.env.local`
- [ ] API Key agregada a Vercel
- [ ] Mapa funciona en `/requests/new`
- [ ] (Opcional) Google AI API Key obtenida
- [ ] (Opcional) Google AI agregada a `.env.local` y Vercel

---

**Nota:** Sin Google Maps API, las funcionalidades de mapas no funcionarán. Sin Google AI, las sugerencias inteligentes no estarán disponibles, pero el resto de la app funcionará normalmente.


