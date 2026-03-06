# Seguridad del Token de Mapbox

## Contexto

El token de Mapbox (`VITE_MAPBOX_TOKEN`) se expone inevitablemente en el bundle del cliente — es un token **público** que Mapbox diseñó para uso frontend. La protección estándar **no es ocultarlo**, sino **restringirlo por dominio** desde la consola de Mapbox.

---

## Pasos para Restringir el Token por Dominio

### 1. Acceder a la consola de Mapbox

- Ve a [https://account.mapbox.com/access-tokens/](https://account.mapbox.com/access-tokens/)
- Inicia sesión con tu cuenta.

### 2. Editar el token existente (o crear uno nuevo)

- Haz clic en el nombre de tu token público actual.
- Si prefieres no modificar el actual, crea uno nuevo con **"Create a token"**.

### 3. Configurar URL Restrictions

En la sección **"URL restrictions"**:

1. Haz clic en **"Add URL"**.
2. Agrega **exactamente** estos dominios (uno por línea):

```
https://keeptrip.app/*
https://www.keeptrip.app/*
https://keeptrip-app-b06b3.web.app/*
https://keeptrip-app-b06b3.firebaseapp.com/*
http://localhost:5173/*
http://localhost:4173/*
```

> **Nota**: Incluir `localhost` permite desarrollo local. Si quieres mayor seguridad, usa un token separado para desarrollo (sin restricción de dominio) y otro para producción.

### 4. Configurar Scopes mínimos

En la sección **"Token scopes"**, marca únicamente los scopes que la app usa:

- [x] `styles:read` — Cargar estilos de mapa
- [x] `fonts:read` — Fuentes de los labels del mapa
- [x] `datasets:read` — Tiles de country-boundaries
- [x] `vision:read` — Geocoding API (buscador de ciudades)

**No marques** scopes de escritura (`styles:write`, `uploads:write`, etc.).

### 5. Guardar

- Clic en **"Save"** o **"Create token"**.
- Copia el nuevo token y actualiza tu `.env`:

```env
VITE_MAPBOX_TOKEN=pk.xxxxx_tu_nuevo_token_restringido
```

### 6. Verificar

1. Abre la app en producción → el mapa debe cargar normalmente.
2. Copia el token del bundle (`view-source:` o DevTools → Network).
3. Intenta usar ese token desde otro dominio (ej. Postman o curl) → debería fallar con `403 Forbidden`.

---

## Recomendación: Tokens separados por entorno

| Entorno       | Token             | URL Restrictions                     |
| ------------- | ----------------- | ------------------------------------- |
| Producción    | `pk.prod_xxxxx`   | Solo dominios de producción          |
| Desarrollo    | `pk.dev_xxxxx`    | `localhost:*` o sin restricción      |

Esto evita que un leak del token de desarrollo afecte producción.

---

## Sobre el Rate Limit

Mapbox tiene un **free tier de 50,000 map loads/mes**. Si alguien abusa de tu token público (aunque restringido), Mapbox cortará las requests al pasar el límite. Puedes configurar alertas de uso en [Account → Statistics](https://account.mapbox.com/statistics/).

---

## Referencias

- [Mapbox Access Tokens Guide](https://docs.mapbox.com/accounts/guides/tokens/)
- [URL Restrictions](https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions)
