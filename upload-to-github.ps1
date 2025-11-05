# Script para subir cambios a GitHub
# Ejecuta este script desde PowerShell: .\upload-to-github.ps1

Write-Host "=== Subiendo cambios a GitHub ===" -ForegroundColor Cyan

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar si Git está instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Git no está instalado. Por favor instálalo primero." -ForegroundColor Red
    exit 1
}

# Inicializar Git si no está inicializado
if (-not (Test-Path ".git")) {
    Write-Host "Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
}

# Configurar el remoto
Write-Host "Configurando remoto de GitHub..." -ForegroundColor Yellow
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote add origin https://github.com/axyra-app/Doctor.git
    Write-Host "Remoto agregado." -ForegroundColor Green
} else {
    git remote set-url origin https://github.com/axyra-app/Doctor.git
    Write-Host "Remoto actualizado." -ForegroundColor Green
}

# Verificar estado
Write-Host "`nVerificando estado del repositorio..." -ForegroundColor Yellow
git status

# Agregar todos los archivos
Write-Host "`nAgregando archivos..." -ForegroundColor Yellow
git add .

# Hacer commit
Write-Host "`nCreando commit..." -ForegroundColor Yellow
$commitMessage = "Fix: Configuración para Vercel - Eliminado next.config.mjs, simplificado build script, creado vercel.json"
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "Commit creado exitosamente." -ForegroundColor Green
} else {
    Write-Host "No hay cambios para commitear o ya están commitados." -ForegroundColor Yellow
}

# Configurar branch main
Write-Host "`nConfigurando branch main..." -ForegroundColor Yellow
git branch -M main

# Intentar hacer pull primero
Write-Host "`nActualizando desde GitHub..." -ForegroundColor Yellow
git pull origin main --rebase --allow-unrelated-histories 2>&1 | Out-Null

# Hacer push
Write-Host "`nSubiendo cambios a GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== ¡Cambios subidos exitosamente! ===" -ForegroundColor Green
    Write-Host "Verifica en: https://github.com/axyra-app/Doctor" -ForegroundColor Cyan
} else {
    Write-Host "`n=== Hubo un error al subir ===" -ForegroundColor Red
    Write-Host "Intenta ejecutar manualmente: git push -u origin main" -ForegroundColor Yellow
}

