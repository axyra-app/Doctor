# 🗺️ Guía Rápida: Obtener Mapbox Access Token

## 📋 Pasos Rápidos (2 minutos)

### Paso 1: Crear Cuenta en Mapbox

1. Ve a: **https://account.mapbox.com/**
2. Haz clic en **"Sign up"** o **"Iniciar sesión"** si ya tienes cuenta
3. Crea cuenta con tu email (gratis)

### Paso 2: Obtener Access Token

1. Una vez dentro, ve a: **https://account.mapbox.com/access-tokens/**
2. Verás tu **"Default public token"** (token público por defecto)
3. **Copia el token** (empieza con `pk.ey...`)

### Paso 3: Configurar en tu Proyecto

**Archivo `.env.local` (local):**
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu-token-aqui
```

**Ejemplo:**
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example
```

### Paso 4: Configurar en Vercel

1. Ve a tu proyecto en **Vercel**
2. **Settings > Environment Variables**
3. Agrega:
   - **Key:** `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
   - **Value:** Tu token de Mapbox
   - **Environments:** Production, Preview, Development
4. Click **Save**
5. **Redeploy** tu aplicación

---

## ✅ Verificar que Funciona

1. Inicia tu servidor: `npm run dev`
2. Abre: `http://localhost:9002`
3. Ve a: `/requests/new` (nueva solicitud)
4. Deberías ver un **mapa interactivo de Mapbox**

---

## 💰 Costos

- **Gratis:** 50,000 cargas de mapa/mes
- **Luego:** $5 USD por cada 1,000 cargas adicionales
- **Con uso normal:** No deberías pagar nada

---

## 🆘 Problemas Comunes

### Error: "Mapbox Access Token no configurado"
- Verifica que `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` esté en `.env.local`
- Reinicia el servidor: `npm run dev`
- Verifica que el token esté correcto

### El mapa no aparece
- Verifica que el token esté correcto
- Revisa la consola del navegador (F12) para ver errores
- Asegúrate de que el token sea público (empieza con `pk.`)

### Error: "Invalid token"
- Verifica que copiaste el token completo
- Asegúrate de que es el token **público** (Default public token)
- No uses tokens secretos

---

## 📚 Enlaces Útiles

- **Mapbox Account:** https://account.mapbox.com/
- **Access Tokens:** https://account.mapbox.com/access-tokens/
- **Documentación Mapbox:** https://docs.mapbox.com/

---

## 🎯 Checklist

- [ ] Cuenta creada en Mapbox
- [ ] Access Token copiado
- [ ] Token agregado a `.env.local`
- [ ] Token agregado a Vercel
- [ ] Mapa funciona en `/requests/new`

---

**¡Listo!** Con estos pasos deberías tener Mapbox funcionando. 🗺️

