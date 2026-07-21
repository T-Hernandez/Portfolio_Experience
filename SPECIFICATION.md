# Portfolio Experience Specification

> Fuente de verdad del proyecto.
>
> Este documento define la visión, experiencia, arquitectura y comportamiento del portafolio.
>
> Cualquier implementación debe seguir este documento antes que asumir decisiones de diseño.

---

# Assets de referencia

## Modelo principal

El modelo fuente de la habitación se encuentra en:

design/blender/room.blend

Este archivo representa la versión editable del escenario.

No debe modificarse su composición general sin actualizar este documento.

---

## Modelo para producción

Cuando el modelo esté finalizado deberá exportarse como:

public/models/room.glb

Este será el archivo utilizado por React Three Fiber.

---

## Referencia de cámara

La imagen

design/reference/initial-camera-angle.png

define el encuadre inicial de la experiencia.

Claude debe utilizarla como referencia para:

- posición inicial
- rotación
- composición
- distancia focal aproximada

No debe inventar un nuevo ángulo de cámara.

---

# Filosofía del proyecto

Blender únicamente define:

- geometría
- materiales
- UVs
- texturas
- composición del escenario

Toda la experiencia ocurre posteriormente dentro de React Three Fiber.

No depender de Blender para:

- iluminación final
- animaciones
- cámara
- shaders
- navegación
- efectos visuales

Todo esto pertenece a la aplicación web.

# Escenario

Existe un único escenario.

No existen cambios de mapa.

No existen nuevas habitaciones.

Toda la experiencia ocurre frente a una única pared.

El usuario nunca abandona este espacio.

Los objetos son los módulos del portafolio.

Cada objeto interactivo debe mantenerse como un objeto independiente dentro del modelo.

Los nombres del modelo deben ser descriptivos.

Ejemplo:

Laptop

Bookshelf

Turntable

Pokewalker

Plant

Desk

Chair

Wall

Floor

# Flujo de trabajo

Blender (.blend)

↓

Exportación a glTF (.glb)

↓

React Three Fiber

↓

Experiencia interactiva

El archivo .blend nunca será utilizado directamente por la aplicación.

Siempre se utilizará la versión exportada (.glb).

# Qué puede modificar Claude

Claude puede:

- iluminación
- shaders
- animaciones
- cámara
- navegación
- UI
- transiciones
- sonido
- optimización del código

---

# Qué NO debe modificar Claude

No reorganizar la habitación.

No mover muebles arbitrariamente.

No cambiar la composición general.

No cambiar el estilo artístico.

No agregar objetos nuevos sin una razón clara.

Debe respetar el modelo creado en Blender.

# Sistema de navegación

La habitación funciona como el sistema operativo del portafolio.

No existen páginas tradicionales.

No existen modales genéricos.

No existe un único tipo de menú.

Cada objeto posee una interfaz propia que refleja su identidad.

Todas las interfaces permanecen integradas visualmente dentro de la habitación.

---

# Patrón general

Estado inicial

↓

El usuario observa la habitación.

↓

Hover sobre un objeto.

↓

El objeto responde visualmente.

↓

Click.

↓

La cámara realiza una transición suave.

↓

El objeto revela su propia interfaz.

↓

El usuario explora esa sección.

↓

Back.

↓

La cámara vuelve exactamente al punto inicial.

# Laptop

Representa:

- Proyectos

Comportamiento:

La cámara se acerca al escritorio.

La pantalla del portátil se enciende.

El monitor se convierte en la interfaz.

No aparece ningún panel externo.

Toda la navegación ocurre dentro del monitor.

El monitor muestra:

- Resume Analyzer
- Lyric Copilot
- Ameliapp
- Próximos proyectos

Al abrir un proyecto:

La pantalla cambia al contenido del proyecto.

Nunca se abandona la habitación.

# Librero

Representa:

- Sobre mí
- Tecnologías
- Experiencia
- Intereses

Comportamiento:

La cámara se desplaza hacia el librero.

Una ficha elegante aparece junto a él.

Debe sentirse como una página de un libro.

No utilizar ventanas flotantes.

No utilizar modales.

# Tocadiscos

Representa:

- Música

Comportamiento:

La cámara se acerca lentamente.

El disco continúa girando.

La interfaz aparece inspirada en un reproductor físico.

Debe sentirse como un elemento del tocadiscos.

No utilizar una lista HTML tradicional.

# Pokewalker

Representa:

- Contacto

Comportamiento:

La cámara se acerca.

Aparece una pequeña libreta o tarjeta.

Contenido:

- GitHub
- LinkedIn
- Email
- CV

Debe sentirse como un objeto apoyado sobre la mesa, junto a la planta decorativa.

# Filosofía de las interfaces

Todas las secciones deben sentirse diferentes.

No reutilizar el mismo panel para todos los objetos.

Cada objeto cuenta una historia distinta.

La interfaz debe adaptarse al objeto, no al contrario.

Ejemplos:

Laptop → interfaz dentro de la pantalla.

Librero → ficha inspirada en una página de libro.

Tocadiscos → reproductor musical.

Pokewalker → tarjeta de contacto.

El usuario debe sentir que está interactuando con el objeto, no con una página web.

# Principio de inmersión

Siempre que sea posible, el contenido debe aparecer como parte del mundo 3D.

Evitar superponer interfaces que oculten completamente la habitación.

El escenario nunca debe desaparecer.

El usuario siempre debe sentir que continúa dentro del cuarto.

# Principios de diseño

Antes de implementar cualquier característica, comprobar si cumple estos principios.

## 1. La habitación siempre es el protagonista.

Las interfaces existen para complementar la habitación, nunca para reemplazarla.

---

## 2. La interacción debe sentirse física.

Siempre que sea posible, las acciones deben parecer consecuencia del objeto seleccionado.

No crear interfaces arbitrarias.

---

## 3. Menos es más.

Es preferible una interacción excelente que diez interacciones mediocres.

---

## 4. Todo debe tener intención.

Cada animación.

Cada transición.

Cada sonido.

Cada movimiento de cámara.

Debe existir porque mejora la experiencia.

Nunca porque "se ve cool".

---

## 5. El usuario explora.

No queremos decirle constantemente dónde hacer click.

Queremos que tenga curiosidad.

El escenario debe invitar a descubrir.

# Rendimiento

La experiencia debe sentirse extremadamente fluida.

Prioridades:

60 FPS constantes.

Modelo optimizado.

Texturas comprimidas.

Lazy loading cuando sea posible.

Animaciones ligeras.

Evitar postprocesado innecesario.

La simplicidad tiene prioridad sobre los efectos visuales.

# Qué hace memorable este proyecto

El objetivo no es impresionar con gráficos.

El objetivo es que el usuario recuerde la experiencia.

Al cerrar el navegador, debería recordar:

"La persona me mostró su trabajo haciéndome entrar a su habitación."

No:

"Vi otro portafolio bonito."