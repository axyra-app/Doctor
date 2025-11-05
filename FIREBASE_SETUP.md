# Configuración Completa de Firebase

## 🔥 Configuración del Proyecto

El proyecto está configurado para usar el proyecto Firebase: **doctor-d1522**

### Archivos Actualizados

1. ✅ `src/firebase/config.ts` - Configuración actualizada
2. ✅ `firestore.rules` - Reglas de seguridad completas
3. ✅ `firestore.indexes.json` - Índices necesarios

## 📋 Variables de Entorno para Vercel

Agrega estas variables en Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyDoucdPhIOMY8W2psJQ0ttd7uy_gx7E1xM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = doctor-d1522.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = doctor-d1522
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = doctor-d1522.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 1012271301645
NEXT_PUBLIC_FIREBASE_APP_ID = 1:1012271301645:web:c4e20f7f91b3a9d6a10144
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = G-J5SL4DGDHL
```

## 🔐 Reglas de Firestore

Las reglas están configuradas en `firestore.rules` con:

### Colecciones:

1. **`users/{userId}`**
   - Solo el propietario puede leer/editar/eliminar su propio documento
   - No se permite listar todos los usuarios
   - Validación de campos requeridos al crear

2. **`appointments/{appointmentId}`**
   - Pacientes pueden crear sus propias citas
   - Pacientes pueden leer/editar/eliminar sus citas
   - Doctores pueden leer/editar citas asignadas a ellos
   - Validación de campos requeridos

3. **`ratings/{ratingId}`**
   - Cualquiera puede leer calificaciones
   - Solo pacientes autenticados pueden crear calificaciones
   - Las calificaciones son inmutables (no se pueden editar/eliminar)
   - Validación de score (1-5)

## 📊 Índices de Firestore

Los índices están configurados en `firestore.indexes.json` para optimizar las siguientes consultas:

### Appointments:
- `patientId` + `status` + `requestDate` (desc)
- `doctorId` + `status` + `requestDate` (desc)
- `status` + `requestDate` (desc)
- `patientId` + `requestDate` (desc)
- `doctorId` + `requestDate` (desc)

### Ratings:
- `doctorId` + `date` (desc)
- `patientId` + `date` (desc)

## 🚀 Desplegar en Firebase

### 1. Instalar Firebase CLI (si no lo tienes)
```bash
npm install -g firebase-tools
```

### 2. Iniciar sesión
```bash
firebase login
```

### 3. Seleccionar el proyecto
```bash
firebase use doctor-d1522
```

### 4. Desplegar Reglas
```bash
firebase deploy --only firestore:rules
```

### 5. Desplegar Índices
```bash
firebase deploy --only firestore:indexes
```

## ⚠️ Notas Importantes

1. **Después de desplegar las reglas e índices**, espera unos minutos a que se propaguen
2. **Los índices pueden tardar en construirse** si hay muchos datos
3. **Verifica que las reglas estén activas** en Firebase Console → Firestore → Rules
4. **Verifica los índices** en Firebase Console → Firestore → Indexes

## 🔍 Verificación

1. Ve a [Firebase Console](https://console.firebase.google.com/project/doctor-d1522)
2. Verifica que las reglas estén desplegadas
3. Verifica que los índices estén construidos
4. Prueba la aplicación en Vercel

## 📝 Estructura de Datos

### Users
```typescript
{
  uid: string;
  email: string | null;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor';
  phone?: string;
  city?: string;
  profilePictureURL?: string;
  specialty?: string; // Solo para doctores
}
```

### Appointments
```typescript
{
  id: string;
  patientId: string;
  doctorId: string | null;
  requestDate: number; // timestamp
  status: 'pending' | 'accepted' | 'en-route' | 'completed' | 'cancelled';
  description: string;
  address: string;
  location?: {
    lat: number;
    lng: number;
  };
}
```

### Ratings
```typescript
{
  id: string;
  doctorId: string;
  patientId: string;
  score: number; // 1-5
  comment: string;
  date: number; // timestamp
}
```

