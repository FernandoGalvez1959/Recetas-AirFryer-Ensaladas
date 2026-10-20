# Recetario Air Fryer y Ensaladas

Recetario de comidas saludables para freidora de aire: 254 recetas con ingredientes,
temperatura, tiempo y preparación.

## Apartados

Desayunos · Meriendas y picoteos · Tapas tradicionales · Tapas modernas ·
Comidas · Cenas · Cenas ligeras · Ensaladas

Además se puede filtrar por tipo de alimento: carnes, aves, pescado, verduras,
huevos, legumbres, fruta, cereales y lácteos.

## Funciones

- Buscador por nombre o ingrediente
- Recetas propias, con uno o varios apartados
- Foto propia en cualquier receta, en lugar del dibujo
- Favoritas
- Copia de seguridad de las recetas propias
- Funciona sin conexión y se puede instalar en el móvil
- Todo se guarda en el propio dispositivo

## Actualizar la app

Sube el `index.html` nuevo y cambia el número de `VERSION` en `sw.js`.
La próxima vez que se abra la app con conexión, en el ordenador o en el móvil,
aparece abajo un aviso de versión nueva con un botón para actualizar.
También hay un botón **Buscar actualización** dentro de la copia de seguridad.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La aplicación completa |
| `manifest.webmanifest` | Nombre, colores e icono al instalarla en el móvil |
| `sw.js` | Guarda la app para usarla sin conexión |
| `icono-192.png`, `icono-512.png` | Icono de la freidora |

Las recetas propias, las favoritas y las fotos se guardan en el propio móvil,
no en GitHub.
