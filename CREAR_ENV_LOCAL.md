# 📝 Crear archivo .env.local

## Pasos Rápidos

1. **En la raíz del proyecto** (donde está `package.json`), crea un archivo llamado `.env.local`

2. **Copia este contenido:**

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoibWVkbGluazAxIiwiYSI6ImNtaGFxeXp3OTB6eHEya3B2enh6c3ljaGIifQ.fNLLY7BuMPp-gsTevR1JoQ
```

3. **Guarda el archivo**

4. **Reinicia el servidor:**
   ```bash
   npm run dev
   ```

## ✅ Verificar que funciona

1. Abre: `http://localhost:9002`
2. Ve a: `/requests/new`
3. Deberías ver el mapa de Mapbox funcionando

---

**Nota:** El archivo `.env.local` está en `.gitignore`, así que no se subirá a GitHub (es seguro).

