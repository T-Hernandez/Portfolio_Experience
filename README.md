# Portfolio Experience

Portafolio inmersivo en 3D construido con React Three Fiber. La visión, filosofía y comportamiento completo del proyecto viven en [SPECIFICATION.md](SPECIFICATION.md) — este README es sobre cómo correr y navegar el código, no repite esa especificación.

## Desarrollo

```bash
npm install
npm run dev
```

## Estado actual

El modelo real ya está integrado: `public/models/room.glb`, cargado en `src/scene/Room.tsx` vía `useGLTF` (deployado en Vercel, redespliega solo con cada push a `main`). No hay geometría placeholder. Los 9 materiales traen textura y las luces de la escena (`light 1`, `light 2`) vienen del `.glb`, no están hardcodeadas — ver la sección "Iluminación" más abajo.

Si un material sale gris (sin textura ni color), casi siempre es porque en Blender su nodo `Base Color` está conectado a algo que el exportador de glTF no sabe traducir (un `Diffuse BSDF` en vez de `Principled BSDF`, o una mezcla de nodos demasiado compleja) — no es un bug de carga del lado de la app.

## El contrato Blender ↔ código

Blender es la fuente de verdad de **qué objetos existen y dónde están** — React nunca guarda la posición de un objeto como constante, la resuelve en runtime por **nombre** vía `scene.getObjectByName(...)`. `src/scene/useRoomScene.ts` es el único punto que carga el `.glb` (`useGLTF`, cacheado por URL); `Room`, `CameraRig` e `InterfaceLayer` llaman a ese mismo hook y comparten la misma instancia de `scene` sin necesidad de un Context — no hay ningún provider de por medio.

El `Box3` de cada objeto interactivo (su posición/tamaño real en el mundo) se calcula **una sola vez por escena**, no en cada transición de cámara — `getObjectBounds(scene, nodeName)` en `useRoomScene.ts` lo cachea en un `WeakMap` keyeado por la instancia de `scene`. `CameraRig` e `InterfaceLayer` leen de ese mismo cache, así que cámara y UI siempre parten exactamente del mismo centro, sin margen para que diverjan por dos cálculos independientes.

Decisión explícita del usuario: **no usar Empties `Camera_*` en Blender** para el encuadre — en su lugar se usan capturas de referencia (`design/reference/Reference *.png`) como guía visual. Esto significa que el *ángulo/distancia* de cada shot de cámara y la posición de cada panel de UI son constantes ajustadas a mano en `src/scene/framing.ts` (no datos leídos del `.blend`), calculadas como un offset sobre el `Box3` real del objeto resuelto por nombre:

| Id interno | Nodo real en el glb | Referencia visual |
|---|---|---|
| `laptop` | `laptop` | `Reference laptop.png` |
| `bookshelf` | `bookshelf` | `Reference bookshelf.png` |
| `turntable` | `turntable` | `Reference turntable.png` |
| `pokewalker` | `pokewalk` | `Reference pokewalker.png` |
| — (vista de reposo) | — | `Reference general view.png` |

Si en Blender se mueve alguno de estos objetos, la cámara y la UI lo siguen automáticamente (dependen de su `Box3` en runtime) — pero si cambia mucho su tamaño o proporción, los offsets de `CAMERA_FRAMING`/`UI_OFFSET` en `framing.ts` probablemente necesiten un reajuste visual (el mismo método: dev server + captura de pantalla comparando contra la referencia).

**Si se renombra un nodo en Blender** (`laptop`, `bookshelf`, `turntable`, `pokewalk`), hay que actualizar `OBJECT_NODE_NAMES` en `src/scene/framing.ts` — si no, ese objeto deja de ser interactivo silenciosamente (no rompe la app, simplemente no se encuentra).

**Si Blender anida estos objetos bajo un grupo nuevo** (ej. `Furniture > laptop`), no hay que tocar nada de código: `InteractiveObject` (`src/scene/interactiveObject.tsx`) resuelve el nodo con `scene.getObjectByName(...)` (recursivo, ignora profundidad) y lo reparenta con `Object3D.attach()`, que preserva su transform mundial real sin importar cuántos niveles tenía de anidado.

### Interactividad

`Room.tsx` monta el `.glb` completo de una — `<primitive object={scene} />` — y dentro de ese mismo `<primitive>` (como hijos JSX, no como hermanos) monta un `<InteractiveObject>` por cada id interactivo. Esto es intencional: cuando `InteractiveObject` reparenta su nodo con `attach()`, el grupo contenedor sigue colgando de `scene`, así que `scene.getObjectByName(...)` (el que usan `CameraRig` e `InterfaceLayer`) sigue encontrando el objeto después del reparenting — si estuvieran fuera del `<primitive>`, quedarían huérfanos de `scene` y esa búsqueda fallaría en silencio.

El hover **no escala el objeto** (deformar un laptop o un tocadiscos real rompe la ilusión) — clona los materiales del nodo (para no afectar a otros objetos que compartan el material original) y les sube el `emissive` un poco, además de cambiar el cursor.

### Encuadre de la UI: offset relativo al tamaño del objeto, no al centro

`UI_OFFSET_FRACTION` en `framing.ts` no es un vector absoluto sumado al centro del `Box3` — es una **fracción del propio tamaño** del objeto (`center + size * fracción`). Sumar directamente el centro del `Box3` sin esto haría que el panel flote en el centro geométrico del objeto (ej. el centro del laptop cae dentro del teclado, no en la pantalla); expresarlo como fracción del tamaño mantiene el desplazamiento proporcional si el objeto cambia de dimensiones. La cámara, en cambio, sí puede partir directamente del centro del `Box3` — para encuadrar un objeto el punto de referencia geométrico es exactamente lo que se necesita.

## Iluminación

Las luces de la escena vienen del `.glb` (`light 1`, `light 2`, exportadas vía `KHR_lights_punctual`), no están hardcodeadas en React — `Experience.tsx` no declara ningún `<ambientLight>`/`<directionalLight>`, se montan solas al cargar `<primitive object={scene}/>` en `Room.tsx`.

Dos cosas no obvias de esta extensión de glTF:

- **Solo soporta luces Point, Spot y Sun (Directional).** Las luces de tipo *Area* de Blender no son exportables por este mecanismo — es una limitación del formato glTF, no de la config del exportador. Si en Blender agregás una luz nueva y no aparece en la app, primero fijate que no sea de tipo Area.
- **La intensidad que exporta Blender está en candela reales** (para esta escena, del orden de cientos de miles) — aplicada tal cual en three.js, el cálculo de sombreado desborda y la escena sale negra, incluso con tone mapping. `useRoomScene.ts` escala la intensidad de cada luz una sola vez por escena (`LIGHT_INTENSITY_SCALE`, actualmente `1/1000`) antes de que nada la use. Si se agregan luces nuevas en Blender con vatios muy distintos a las actuales, ese factor fijo puede no quedar bien calibrado — es una constante ajustada a ojo contra esta escena puntual, no una conversión física exacta.

`Experience.tsx` también configura `toneMapping: ACESFilmicToneMapping` en el `<Canvas>` — comprime el rango dinámico de esas intensidades reales a algo que un monitor puede mostrar sin quemar los blancos.

## Título en la pared

`src/scene/CinematicTitle.tsx` monta texto 3D (`Text` de drei) directamente sobre el hueco de pared que el usuario dejó libre en el modelo — no es un overlay DOM, es parte del mundo. Se oculta cuando `mode === 'focused'` (al enfocar un objeto). Si se reencuadra la vista general o se mueve la pared en Blender, su posición (`[-3.2, 10, -1]`) probablemente necesite recalibrarse — ver la nota en el propio archivo sobre cómo se llegó a esos números (iterando contra capturas de pantalla).
