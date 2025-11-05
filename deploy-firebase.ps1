# Script para desplegar reglas e índices de Firestore
# Ejecuta este script desde PowerShell: .\deploy-firebase.ps1

Write-Host "=== Desplegando Firestore Rules e Indexes ===" -ForegroundColor Cyan

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "firestore.rules")) {
    Write-Host "Error: No se encontró firestore.rules. Asegúrate de estar en el directorio del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar si Firebase CLI está instalado
$firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseInstalled) {
    Write-Host "Firebase CLI no está instalado. Instalando..." -ForegroundColor Yellow
    
    # Intentar con npm global
    $npmInstalled = Get-Command npm -ErrorAction SilentlyContinue
    if ($npmInstalled) {
        npm install -g firebase-tools
        Write-Host "Firebase CLI instalado." -ForegroundColor Green
    } else {
        Write-Host "Error: npm no está disponible. Por favor instala Node.js primero." -ForegroundColor Red
        Write-Host "Descarga Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
}

# Verificar si está logueado
Write-Host "`nVerificando autenticación..." -ForegroundColor Yellow
$firebaseUser = firebase login:list 2>&1
if ($LASTEXITCODE -ne 0 -or $firebaseUser -match "No authorized accounts") {
    Write-Host "No estás logueado. Iniciando sesión..." -ForegroundColor Yellow
    firebase login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error al iniciar sesión." -ForegroundColor Red
        exit 1
    }
}

# Seleccionar el proyecto
Write-Host "`nSeleccionando proyecto doctor-d1522..." -ForegroundColor Yellow
firebase use doctor-d1522
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al seleccionar el proyecto." -ForegroundColor Red
    exit 1
}

# Desplegar reglas
Write-Host "`nDesplegando reglas de Firestore..." -ForegroundColor Yellow
firebase deploy --only firestore:rules
if ($LASTEXITCODE -eq 0) {
    Write-Host "Reglas desplegadas exitosamente." -ForegroundColor Green
} else {
    Write-Host "Error al desplegar las reglas." -ForegroundColor Red
    exit 1
}

# Desplegar índices
Write-Host "`nDesplegando índices de Firestore..." -ForegroundColor Yellow
firebase deploy --only firestore:indexes
if ($LASTEXITCODE -eq 0) {
    Write-Host "Índices desplegados exitosamente." -ForegroundColor Green
} else {
    Write-Host "Error al desplegar los índices." -ForegroundColor Red
    exit 1
}

Write-Host "`n=== ¡Despliegue completado! ===" -ForegroundColor Green
Write-Host "Las reglas e índices están siendo desplegados. Esto puede tomar unos minutos." -ForegroundColor Cyan
Write-Host "Verifica en: https://console.firebase.google.com/project/doctor-d1522/firestore" -ForegroundColor Cyan

