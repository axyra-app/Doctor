# Variables de Entorno para Vercel

## 🔥 Variables de Firebase (REQUERIDAS)

Ve a tu proyecto en Vercel → **Settings** → **Environment Variables** y agrega estas variables:

### Variables a Agregar:

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyDoucdPhIOMY8W2psJQ0ttd7uy_gx7E1xM` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `doctor-d1522.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `doctor-d1522` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `doctor-d1522.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `1012271301645` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:1012271301645:web:c4e20f7f91b3a9d6a10144` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-J5SL4DGDHL` (opcional) |

## 📝 Instrucciones Paso a Paso:

1. **Ve a Vercel Dashboard**: https://vercel.com/dashboard
2. **Selecciona tu proyecto** `doctor` (o el nombre que tengas)
3. **Ve a Settings** (Configuración)
4. **Haz clic en "Environment Variables"** (Variables de Entorno)
5. **Agrega cada variable una por una:**
   - Haz clic en "Add New"
   - Ingresa el **Key** (nombre de la variable)
   - Ingresa el **Value** (valor)
   - Selecciona los **Environments** (Production, Preview, Development - marca todos)
   - Haz clic en "Save"
6. **Repite para cada variable** de la lista de arriba

## ⚙️ Configuración Opcional:

### Si usas Genkit (Google AI):
- `GOOGLE_GENAI_API_KEY` - Tu API key de Google AI Studio

## 🔄 Después de Agregar las Variables:

1. **Haz un nuevo deployment** (Redeploy)
   - Ve a la pestaña "Deployments"
   - Haz clic en los tres puntos (...) del último deployment
   - Selecciona "Redeploy"
   - O simplemente haz un nuevo commit/push a GitHub

2. **Espera a que termine el build**

3. **Verifica que la aplicación funcione**

## ✅ Verificación:

Después del deployment, verifica en la consola del navegador que NO aparezca el error:
- ❌ "Firebase: Need to provide options"
- ✅ Debería inicializar sin errores

## 📌 Notas Importantes:

- **Todas las variables deben tener el prefijo `NEXT_PUBLIC_`** para que estén disponibles en el cliente (browser)
- **Marca todos los environments** (Production, Preview, Development) al agregar las variables
- **No necesitas reiniciar nada**, solo hacer un nuevo deployment

