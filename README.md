# Portfolio Experience

Portafolio inmersivo en 3D construido con React Three Fiber. La visión, filosofía y comportamiento completo del proyecto viven en [SPECIFICATION.md](SPECIFICATION.md) — este README es sobre cómo correr y navegar el código, no repite esa especificación.

## Desarrollo

```bash
npm install
npm run dev
```

## Estado actual

El modelo real ya está integrado: `public/models/room.glb`, cargado en `src/scene/Room.tsx` vía `useGLTF` (deployado en Vercel, redespliega solo con cada push a `main`). No hay geometría placeholder. Los 9 materiales traen textura y la luz de la escena (`light 1`) viene del `.glb`, no está hardcodeada — ver la sección "Iluminación" más abajo.

Si un material sale gris (sin textura ni color), casi siempre es porque en Blender su nodo `Base Color` está conectado a algo que el exportador de glTF no sabe traducir (un `Diffuse BSDF` en vez de `Principled BSDF`, o una mezcla de nodos demasiado compleja) — no es un bug de carga del lado de la app.

## El contrato Blender ↔ código

Blender es la fuente de verdad de **qué objetos existen y dónde están** — React nunca guarda la posición de un objeto como constante, la resuelve en runtime por **nombre** vía `scene.getObjectByName(...)`. `src/scene/useRoomScene.ts` es el único punto que carga el `.glb` (`useGLTF`, cacheado por URL); `Room`, `CameraRig` e `InterfaceLayer` llaman a ese mismo hook y comparten la misma instancia de `scene` sin necesidad de un Context — no hay ningún provider de por medio.

El `Box3` de cada objeto interactivo (su posición/tamaño real en el mundo) se calcula **una sola vez por escena**, no en cada transición de cámara — `getObjectBounds(scene, nodeName)` en `useRoomScene.ts` lo cachea en un `WeakMap` keyeado por la instancia de `scene`. `CameraRig` e `InterfaceLayer` leen de ese mismo cache, así que cámara y UI siempre parten exactamente del mismo centro, sin margen para que diverjan por dos cálculos independientes.

**El encuadre de cámara viene de cámaras reales en Blender**, no de constantes ajustadas a mano. El `.glb` trae 5 nodos tipo `camera` (uno por shot): `general_camera` (vista de reposo), `laptop_camera`, `bookshelf_camera`, `turntable_camera`, `pokewalk_camera`. `CameraRig.tsx` resuelve el nodo por nombre y copia su posición/rotación/fov mundiales directo — no hay ningún cálculo de offset ni lookAt de por medio.

| Id interno | Nodo de objeto en el glb | Nodo de cámara en el glb |
|---|---|---|
| `laptop` | `laptop` | `laptop_camera` |
| `bookshelf` | `bookshelf` | `bookshelf_camera` |
| `turntable` | `turntable` | `turntable_camera` |
| `pokewalker` | `pokewalk` | `pokewalk_camera` |
| — (vista de reposo) | — | `general_camera` |

**Gotcha importante:** three.js reemplaza los espacios por guiones bajos al parsear nombres de nodo del glTF — en Blender la cámara se llama "laptop camera" (con espacio), pero `scene.getObjectByName(...)` necesita `"laptop_camera"`. Los nombres en `CAMERA_NODE_NAMES`/`DEFAULT_CAMERA_NODE_NAME` (`src/scene/framing.ts`) ya usan la versión con guión bajo — si se agrega una cámara nueva en Blender, hay que mapearla ahí con el guión bajo, no con el nombre tal cual aparece en Blender.

**Historial:** hubo una versión anterior de este proyecto donde el usuario decidió explícitamente NO usar cámaras de Blender y en su lugar ajustar offsets a mano contra capturas de referencia — esa decisión se revirtió por completo (2026-07-23): el usuario agregó las 5 cámaras reales en Blender y pidió usarlas tal cual, sin inventar ni ajustar nada por código. Si en algún momento se vuelve a un modelo sin estas cámaras, ese enfoque anterior queda documentado en el historial de git, pero no es el estado actual del proyecto.

Si en Blender se mueve alguno de los objetos interactivos, la UI lo sigue automáticamente (depende de su `Box3` en runtime) — la cámara, en cambio, depende pura y exclusivamente de dónde esté posicionado su propio nodo `camera`, así que moverla en Blender y re-exportar es la única forma de cambiar un encuadre.

**Si se renombra un nodo en Blender** (`laptop`, `bookshelf`, `turntable`, `pokewalk`), hay que actualizar `OBJECT_NODE_NAMES` en `src/scene/framing.ts` — si no, ese objeto deja de ser interactivo silenciosamente (no rompe la app, simplemente no se encuentra).

**Si Blender anida estos objetos bajo un grupo nuevo** (ej. `Furniture > laptop`), no hay que tocar nada de código: `InteractiveObject` (`src/scene/interactiveObject.tsx`) resuelve el nodo con `scene.getObjectByName(...)` (recursivo, ignora profundidad) y lo reparenta con `Object3D.attach()`, que preserva su transform mundial real sin importar cuántos niveles tenía de anidado.

### Interactividad

`Room.tsx` monta el `.glb` completo de una — `<primitive object={scene} />` — y dentro de ese mismo `<primitive>` (como hijos JSX, no como hermanos) monta un `<InteractiveObject>` por cada id interactivo. Esto es intencional: cuando `InteractiveObject` reparenta su nodo con `attach()`, el grupo contenedor sigue colgando de `scene`, así que `scene.getObjectByName(...)` (el que usan `CameraRig` e `InterfaceLayer`) sigue encontrando el objeto después del reparenting — si estuvieran fuera del `<primitive>`, quedarían huérfanos de `scene` y esa búsqueda fallaría en silencio.

El hover **no escala el objeto** (deformar un laptop o un tocadiscos real rompe la ilusión) — clona los materiales del nodo (para no afectar a otros objetos que compartan el material original) y les sube el `emissive` un poco, además de cambiar el cursor.

### Panel de UI: billboard hacia cámara

Los 4 paneles (`InterfaceLayer.tsx`) se renderizan con `<Html center>` — siempre encarados hacia la cámara activa, sin rotación fija. Antes el panel del laptop usaba `transform` + una rotación (`LAPTOP_SCREEN_TILT`) calibrada a mano para quedar "pegado" a la pantalla en el ángulo viejo; al pasar a cámaras reales de Blender esa rotación fija quedó mirando para cualquier lado y el panel se volvía invisible. Se simplificó a billboard como los otros 3 paneles — se pierde el efecto de "pegado a la superficie con perspectiva", pero es robusto a cualquier ángulo de cámara.

### Encuadre de la UI: offset relativo al tamaño del objeto, no al centro

`UI_OFFSET_FRACTION` en `framing.ts` no es un vector absoluto sumado al centro del `Box3` — es una **fracción del propio tamaño** del objeto (`center + size * fracción`). Sumar directamente el centro del `Box3` sin esto haría que el panel flote en el centro geométrico del objeto (ej. el centro del laptop cae dentro del teclado, no en la pantalla); expresarlo como fracción del tamaño mantiene el desplazamiento proporcional si el objeto cambia de dimensiones. La cámara, en cambio, sí puede partir directamente del centro del `Box3` — para encuadrar un objeto el punto de referencia geométrico es exactamente lo que se necesita.

## Iluminación

La luz de la escena viene del `.glb` (`light 1`, exportada vía `KHR_lights_punctual`), no está hardcodeada en React — `Experience.tsx` no declara ningún `<ambientLight>`/`<directionalLight>`, se monta sola al cargar `<primitive object={scene}/>` en `Room.tsx`. Originalmente había una segunda luz (`light 2`); se eliminó en Blender porque, convertida de Area a Point, generaba un highlight quemado en la pared cercana (ver debajo) — con una sola luz el balance quedó mucho más parecido al render de Blender.

Dos cosas no obvias de esta extensión de glTF:

- **Solo soporta luces Point, Spot y Sun (Directional).** Las luces de tipo *Area* de Blender no son exportables por este mecanismo — es una limitación del formato glTF, no de la config del exportador. Si en Blender agregás una luz nueva y no aparece en la app, primero fijate que no sea de tipo Area. Una luz de Área convertida a Point concentra toda su potencia en un punto matemático, así que de cerca se ve mucho más intensa que la original (caída inversa al cuadrado sin la superficie que la suavizaba).
- **La intensidad que exporta Blender está en candela reales** (para esta escena, cientos de miles) — aplicada tal cual en three.js, el cálculo de sombreado desborda y la escena sale negra, incluso con tone mapping. `useRoomScene.ts` escala la intensidad una sola vez por escena (`LIGHT_INTENSITY_SCALE`, actualmente `1/450`) antes de que nada la use. Si se agregan luces nuevas en Blender con vatios muy distintos a las actuales, ese factor fijo probablemente necesite retunearse — es una constante ajustada a ojo contra esta escena puntual, no una conversión física exacta. **Cuidado al bajar el `decay` de una PointLight para suavizar su caída**: se probó y volvió a romper el shading (pantalla negra) — un decay menor hace que la luz alcance mucho más lejos con la misma intensidad, y con candelas de este tamaño eso desborda en otra parte de la escena. Quedó en el valor físico por defecto (2).

`Experience.tsx` también configura `toneMapping: ACESFilmicToneMapping` en el `<Canvas>` — comprime el rango dinámico de esas intensidades reales a algo que un monitor puede mostrar sin quemar los blancos.

**Límite conocido, no un bug:** Blender renderiza con Cycles (path tracing con iluminación global — la luz rebota y suaviza toda la escena). Three.js en tiempo real solo calcula luz directa, sin rebotes. Con una sola luz puntual, no existe un valor de intensidad que evite highlights quemados cerca de la luz *y* mantenga el detalle en zonas alejadas (como el librero) sin margen — es una limitación estructural del modelo de iluminación, no algo mal configurado. `LIGHT_INTENSITY_SCALE` se ajustó para acercarse lo más posible al render de referencia de Blender sin quemar highlights.

## Título en la pared

`src/scene/CinematicTitle.tsx` monta texto 3D (`Text` de drei) directamente sobre el hueco de pared que el usuario dejó libre en el modelo — no es un overlay DOM, es parte del mundo. Se oculta cuando `mode === 'focused'` (al enfocar un objeto). Si se reencuadra la vista general o se mueve la pared en Blender, su posición (`[-3.2, 10, -1]`) probablemente necesite recalibrarse — ver la nota en el propio archivo sobre cómo se llegó a esos números (iterando contra capturas de pantalla).
