# Atelier — editor de portafolio

App web para que una persona de diseño arme su portafolio, elija un look y publique un enlace de solo lectura.

## Qué incluye

- Editor con nombre, foto de perfil, bio, redes y estadísticas opcionales
- Proyectos con bocetos, proceso, resultado final y texto por etapa (todo opcional)
- Dos temas fieles a las paletas de referencia: **Violet Night** y **Lilac Studio**
- Estilos de foto (neón, estudio, dispositivo, polaroid, editorial) y color de acento
- Publicación con URL pública en `/p/[id]` sin el editor

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) y entra a **Crear mi portafolio**.

## Subir a Vercel

1. Sube el repo a GitHub.
2. Importa el proyecto en [Vercel](https://vercel.com).
3. Deploy. No hace falta base de datos.

El borrador vive en el navegador de quien edita. El enlace público sirve la versión publicada para quien lo reciba.
