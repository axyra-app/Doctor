# Comandos para subir cambios a GitHub

Sigue estos pasos en tu terminal (PowerShell o Git Bash) para subir los cambios a GitHub:

## Paso 1: Navegar al directorio del proyecto
```powershell
cd "C:\Users\Hernán Darío Taborda\Desktop\Doctor"
```

## Paso 2: Inicializar Git (si no está inicializado)
```powershell
git init
```

## Paso 3: Agregar el remoto de GitHub
```powershell
git remote add origin https://github.com/axyra-app/Doctor.git
```

Si ya existe el remoto, actualízalo:
```powershell
git remote set-url origin https://github.com/axyra-app/Doctor.git
```

## Paso 4: Verificar qué archivos se han modificado
```powershell
git status
```

## Paso 5: Agregar todos los cambios
```powershell
git add .
```

## Paso 6: Hacer commit de los cambios
```powershell
git commit -m "Fix: Configuración para Vercel - Eliminado next.config.mjs, simplificado build script, creado vercel.json"
```

## Paso 7: Subir a GitHub

Si es la primera vez:
```powershell
git branch -M main
git push -u origin main
```

Si ya existe el repositorio:
```powershell
git pull origin main --rebase
git push origin main
```

## Si hay conflictos

Si hay conflictos al hacer pull:
```powershell
git pull origin main --rebase
# Resolver conflictos si los hay
git push origin main
```

## Verificar que todo esté bien

Después de hacer push, verifica en GitHub:
1. Ve a https://github.com/axyra-app/Doctor
2. Verifica que los archivos estén actualizados
3. Verifica que `vercel.json` esté presente
4. Verifica que `next.config.mjs` NO esté presente (fue eliminado)

## Conectar con Vercel

Una vez que los cambios estén en GitHub:

1. Ve a [vercel.com](https://vercel.com) y inicia sesión
2. Haz clic en "Add New Project" o busca tu proyecto si ya existe
3. Si ya existe, ve a Settings y verifica que esté conectado al repositorio correcto
4. Haz un nuevo deployment (si no se hace automáticamente)
5. Verifica que el build se complete correctamente

## Archivos modificados/creados

Los siguientes archivos fueron modificados o creados para Vercel:

- ✅ `next.config.ts` - Consolidado (eliminado next.config.mjs)
- ✅ `package.json` - Script de build simplificado
- ✅ `vercel.json` - Configuración para Vercel (nuevo)
- ✅ `VERCEL_SETUP.md` - Guía de setup (nuevo)
- ✅ `GITHUB_UPLOAD.md` - Este archivo (nuevo)

## Nota importante

Si tienes problemas con caracteres especiales en PowerShell, puedes usar Git Bash en su lugar, o ejecutar los comandos desde VS Code usando el terminal integrado.

