# Instrucciones para Desplegar Firestore Manualmente

Debido a problemas con la consola, aquí están las opciones para desplegar las reglas e índices:

## Opción 1: Usar Firebase Console (Web) - MÁS FÁCIL

### Para las Reglas:

1. Ve a [Firebase Console](https://console.firebase.google.com/project/doctor-d1522/firestore/rules)
2. Haz clic en "Editar reglas"
3. Copia el contenido de `firestore.rules`
4. Pega el contenido en el editor
5. Haz clic en "Publicar"

### Para los Índices:

1. Ve a [Firebase Console](https://console.firebase.google.com/project/doctor-d1522/firestore/indexes)
2. Haz clic en "Agregar índice"
3. O ve a la pestaña "Índices compuestos"
4. Agrega manualmente estos índices:

#### Índices para Appointments:

**Índice 1:**
- Collection ID: `appointments`
- Fields:
  - `patientId` (Ascending)
  - `status` (Ascending)
  - `requestDate` (Descending)

**Índice 2:**
- Collection ID: `appointments`
- Fields:
  - `doctorId` (Ascending)
  - `status` (Ascending)
  - `requestDate` (Descending)

**Índice 3:**
- Collection ID: `appointments`
- Fields:
  - `status` (Ascending)
  - `requestDate` (Descending)

**Índice 4:**
- Collection ID: `appointments`
- Fields:
  - `patientId` (Ascending)
  - `requestDate` (Descending)

**Índice 5:**
- Collection ID: `appointments`
- Fields:
  - `doctorId` (Ascending)
  - `requestDate` (Descending)

#### Índices para Ratings:

**Índice 6:**
- Collection ID: `ratings`
- Fields:
  - `doctorId` (Ascending)
  - `date` (Descending)

**Índice 7:**
- Collection ID: `ratings`
- Fields:
  - `patientId` (Ascending)
  - `date` (Descending)

## Opción 2: Usar Firebase CLI desde Terminal

Si tienes Node.js instalado, puedes usar el script PowerShell:

```powershell
.\deploy-firebase.ps1
```

O ejecuta estos comandos manualmente:

```bash
# Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Seleccionar el proyecto
firebase use doctor-d1522

# Desplegar reglas
firebase deploy --only firestore:rules

# Desplegar índices
firebase deploy --only firestore:indexes
```

## Opción 3: Importar desde Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/project/doctor-d1522/firestore)
2. Haz clic en "Reglas" → "Importar desde archivo"
3. Selecciona el archivo `firestore.rules`
4. Haz clic en "Publicar"

Para los índices, Firebase los detectará automáticamente cuando intentes hacer una consulta que los requiera, pero es mejor agregarlos manualmente como se describe en la Opción 1.

## Verificación

Después de desplegar:

1. Ve a [Firestore Rules](https://console.firebase.google.com/project/doctor-d1522/firestore/rules)
2. Verifica que las reglas estén publicadas
3. Ve a [Firestore Indexes](https://console.firebase.google.com/project/doctor-d1522/firestore/indexes)
4. Verifica que los índices estén construyéndose o estén listos

## Notas Importantes

- ⏱️ Los índices pueden tardar varios minutos en construirse si hay datos
- 🔄 Las reglas se aplican inmediatamente después de publicar
- ✅ Verifica que no haya errores en la consola de Firebase

