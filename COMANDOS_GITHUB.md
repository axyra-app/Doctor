# Comandos para Subir a GitHub

## Opción 1: Usar el Script Automático (Recomendado)

Ejecuta este comando en PowerShell desde el directorio del proyecto:

```powershell
.\subir-github.ps1
```

## Opción 2: Comandos Manuales

Si prefieres hacerlo manualmente, ejecuta estos comandos uno por uno:

```powershell
# 1. Navegar al directorio (si no estás ahí)
cd "C:\Users\Hernán Darío Taborda\Desktop\Doctor"

# 2. Ver estado
git status

# 3. Agregar todos los cambios
git add .

# 4. Hacer commit
git commit -m "feat: Mejoras completas - Formulario de solicitudes mejorado, vistas actualizadas, integración completa con Firebase"

# 5. Configurar remoto (si no está configurado)
git remote add origin https://github.com/axyra-app/Doctor.git
# O si ya existe, actualizarlo:
git remote set-url origin https://github.com/axyra-app/Doctor.git

# 6. Configurar branch
git branch -M main

# 7. Hacer pull (si hay cambios remotos)
git pull origin main --rebase --allow-unrelated-histories

# 8. Subir cambios
git push -u origin main
```

## Verificación

Después de subir, verifica:
1. Ve a https://github.com/axyra-app/Doctor
2. Verifica que los cambios estén presentes
3. Vercel debería hacer un deployment automático

## Notas

- Si es la primera vez, Git puede pedirte autenticación
- Si tienes problemas, puedes usar GitHub Desktop o VS Code
- El script automático maneja todos los casos comunes

