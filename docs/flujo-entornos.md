# Flujo de trabajo: entornos y Firebase

Este proyecto usa dos modos de trabajo en desarrollo:

- Emuladores (desarrollo diario, rapido y seguro).
- Staging (Firebase real para cargar portadas y datos que deben persistir).

## Conceptos simples

- Emuladores: versiones locales de Auth, Firestore y Storage. No afectan datos reales.
- Staging: proyecto Firebase real separado del principal.
- Produccion: cuando exista, sera otro proyecto Firebase con datos reales.

## Archivos de entorno

- .env: variables locales para desarrollo diario.
- .env.staging: variables para staging.
- .env.example: ejemplo de variables.

## Variables clave

- VITE_USE_EMULATORS=true o false
- VITE_FIREBASE_* (credenciales del proyecto Firebase)

## Como trabajar

### Desarrollo diario (emuladores)

- Asegurate de tener VITE_USE_EMULATORS=true en .env
- Comando:

```
npm run dev
```

### Cargar portadas y datos que deben persistir (staging)

- .env.staging ya tiene VITE_USE_EMULATORS=false
- Comando:

```
npm run dev:staging
```

## Cambiar entre modos

- Emuladores -> npm run dev
- Staging -> npm run dev:staging

## Notas

- En localhost, el proyecto solo usa emuladores si VITE_USE_EMULATORS=true.
- .env.staging no se sube al repositorio.
