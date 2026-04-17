# Configuración del Mapa — HomeMap Dashboard

> Archivo de referencia para los parámetros de viewport del mapa en `src/features/mapa/ui/HomeMap.jsx`.
> Actualizado tras el proceso de iteración de ajuste visual (abril 2026).

---

## Contexto

El mapa del dashboard muestra el mundo habitado en proyección **Mercator 2D** usando `react-map-gl` con Mapbox GL JS. La configuración es **estática** (sin interacción del usuario: pan/zoom desactivados), optimizada para ser una vista de exploración personal.

> **Regla inamovible**: La proyección `mercator` y `renderWorldCopies={false}` **nunca se deben modificar**. Son decisiones de arquitectura que afectan el score de Lighthouse (performance) y la coherencia visual de la app.

---

## El problema geométrico en Mercator

En proyección Mercator, el mundo habitado (desde el sur de Argentina hasta el norte de Rusia) tiene un **aspect ratio mayor a 1.9:1** en píxeles. Esto genera comportamientos distintos según el viewport:

| Viewport | Contenedor | Ratio contenedor | Comportamiento |
|---|---|---|---|
| Desktop | ~750×500px variable | ~1.3:1 a 1.5:1 | El **alto** tiende a ser la dimensión limitante |
| Mobile | 240px fijo × ~390px | ~1.6:1 fijo | El **ancho** es siempre la dimensión limitante |

Cuando el ancho es limitante (mobile), el contenido de latitud ocupa menos píxeles que el alto del contenedor. El área restante muestra el color de fondo (`#e0e6ed`). **~17px por lado es el mínimo inherente al Mercator 2D** con longitud completa en un contenedor panorámico — no se puede eliminar sin recortar continentes o cambiar la proyección.

---

## Configuración final verificada

### Desktop

```js
const WORLD_BOUNDS_DESKTOP = [[-170, -58], [170, 74]];
const WORLD_PADDING_DESKTOP = { top: 25, bottom: 10, left: 8, right: 8 };
```

**Racional:**
- **Bounds**: `-58°S` cubre el sur de Argentina/Patagonia; `74°N` cubre el norte de Rusia/Escandinavia con margen.
- **Padding asimétrico (`top: 25, bottom: 10`)**: En Mercator, las zonas polares están visualmente infladas. El padding mayor arriba desplaza el centro visual hacia el sur, equilibrando el encuadre del mundo habitado sin mostrar exceso ártico.
- **Este ajuste es el resultado óptimo validado visualmente** — el mapa se ve completo N/S sin recortes.

### Mobile

```js
const WORLD_BOUNDS_MOBILE = [[-170, -58], [170, 74]];
const WORLD_PADDING_MOBILE = { top: 10, bottom: 2, left: 2, right: 2 };
```

**Racional:**
- **Bounds**: Idénticos al desktop para mostrar el mundo completo sin recortes en los laterales.
- **Constraint geométrico inevitable**: El contenedor mobile (240×390px, ratio 1.6:1) es más angosto que el mundo en Mercator (ratio ~1.96:1). Con longitud completa, el ancho siempre es la dimensión limitante → aparecen ~17px de océano arriba y abajo. No es un bug — es física de Mercator.
- **Padding asimétrico (`top: 10, bottom: 2`)**: Compensa la distorsión polar y centra visualmente el mundo habitado.
- **Alternativa descartada**: Recortar longitud a `[-120, 155]` nivelaría las dimensiones, pero recorta Alaska occidental, Hawaii y Nueva Zelanda. La preferencia es mostrar el mundo completo.

---

## Otros parámetros fijos (no modificar)

```js
const MAP_OCEAN_COLOR  = '#e0e6ed';   // color de fondo = océano + áreas vacías
const MIN_WORLD_ZOOM   = -2;          // permite zoom-out en pantallas pequeñas

// En el componente <Map>:
projection="mercator"           // NO CAMBIAR — requisito de arquitectura
renderWorldCopies={false}       // NO CAMBIAR — evita duplicación del globo
maxZoom={4}                     // Límite para que el usuario no haga zoom sin sentido
```

---

## Flujo de posicionamiento

```
onLoad → handleMapLoad → fitWorld(map)
                          ↓
           lee isMobileRef.current
                          ↓
           .fitBounds(bounds, { padding, duration: 0 })

ResizeObserver → map.resize() → fitWorld(map)  ← siempre usa isMobileRef (no stale closure)
```

El `isMobileRef` es importante: el `ResizeObserver` captura `fitWorld` en un closure. Sin el ref, un cambio de `isMobile` (p.ej. resize de desktop a mobile) usaría el valor antiguo de la prop.

---

## Si el mapa no se ve bien tras un cambio de contenedor

1. Verificar que `isMobile` se pasa correctamente desde `DashboardPage.jsx`:
   ```jsx
   <HomeMap paisesVisitados={countriesVisited} isMobile={isMobileLayout} />
   ```
2. Ajustar primero `WORLD_PADDING_*` (cambios menores, no rompen nada).
3. Ajustar `WORLD_BOUNDS_*` solo si el contenedor cambia de aspect ratio significativamente.
4. **Nunca** cambiar `projection`, `renderWorldCopies`, ni la arquitectura de carga diferida (interaction-based lazy loading).
