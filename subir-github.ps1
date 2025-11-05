# Script para subir cambios a GitHub
# Ejecuta este script desde PowerShell: .\subir-github.ps1

Write-Host "=== Subiendo cambios a GitHub ===" -ForegroundColor Cyan

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto." -ForegroundColor Red
    Write-Host "Ejecuta: cd 'C:\Users\Hernán Darío Taborda\Desktop\Doctor'" -ForegroundColor Yellow
    exit 1
}

# Verificar si Git está instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Git no está instalado. Por favor instálalo primero." -ForegroundColor Red
    exit 1
}

# Verificar estado
Write-Host "`nVerificando estado del repositorio..." -ForegroundColor Yellow
git status

# Agregar todos los archivos
Write-Host "`nAgregando archivos..." -ForegroundColor Yellow
git add .

# Verificar qué se agregó
Write-Host "`nArchivos preparados para commit:" -ForegroundColor Yellow
git status --short

# Hacer commit
Write-Host "`nCreando commit..." -ForegroundColor Yellow
$commitMessage = "feat: Mejoras completas - Formulario de solicitudes mejorado, vistas actualizadas, integración completa con Firebase"
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "Commit creado exitosamente." -ForegroundColor Green
} else {
    Write-Host "No hay cambios para commitear o ya están commitados." -ForegroundColor Yellow
    
    # Verificar si hay cambios sin commitear
    $status = git status --porcelain
    if ($status) {
        Write-Host "Hay cambios sin commitear. Intentando commitear..." -ForegroundColor Yellow
        git commit -m $commitMessage
    }
}

# Configurar branch main si no existe
Write-Host "`nConfigurando branch main..." -ForegroundColor Yellow
git branch -M main 2>&1 | Out-Null

# Verificar remoto
Write-Host "`nVerificando remoto..." -ForegroundColor Yellow
$remoteExists = git remote get-url origin 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Configurando remoto de GitHub..." -ForegroundColor Yellow
    git remote add origin https://github.com/axyra-app/Doctor.git
    Write-Host "Remoto agregado." -ForegroundColor Green
} else {
    Write-Host "Remoto ya configurado: $remoteExists" -ForegroundColor Green
    # Asegurar que el remoto sea correcto
    git remote set-url origin https://github.com/axyra-app/Doctor.git
}

# Intentar hacer pull primero (si hay cambios remotos)
Write-Host "`nActualizando desde GitHub..." -ForegroundColor Yellow
git pull origin main --rebase --allow-unrelated-histories 2>&1 | Out-Null

# Hacer push
Write-Host "`nSubiendo cambios a GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== ¡Cambios subidos exitosamente! ===" -ForegroundColor Green
    Write-Host "Verifica en: https://github.com/axyra-app/Doctor" -ForegroundColor Cyan
    Write-Host "`nVercel debería detectar automáticamente los cambios y hacer un nuevo deployment." -ForegroundColor Cyan
} else {
    Write-Host "`n=== Hubo un error al subir ===" -ForegroundColor Red
    Write-Host "Intenta ejecutar manualmente:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor Yellow
    Write-Host "`nO verifica los errores arriba." -ForegroundColor Yellow
}

