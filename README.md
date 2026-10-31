# Alcanza — ¿Cuándo me lo compro?

Frontend de Alcanza (React + Vite + Tailwind CSS).

## Instalar y ejecutar

```bash
npm install
npm run dev
```

## Librerías

| Librería | Para qué |
|---|---|
| react / react-dom | Base de la interfaz |
| tailwindcss + @tailwindcss/vite | Estilos (paleta en `src/index.css`) |
| react-router-dom | Navegación entre páginas |
| recharts | Gráficas de ahorro |
| framer-motion | Animaciones |
| lucide-react | Íconos |
| canvas-confetti | Celebración al cumplir una meta |
| html-to-image | Exportar tarjetas como imagen |
| axios | Conexión con la API de Laravel |

## Estructura

```
src/
  assets/      imágenes y recursos
  components/  componentes reutilizables
  context/     estados globales (Context API)
  hooks/       hooks personalizados
  layouts/     plantillas de página (navbar, footer)
  pages/       páginas de la app
  services/    llamadas a APIs (axios)
  utils/       funciones de apoyo (formatos, cálculos)
  App.jsx      componente raíz
  index.css    Tailwind + paleta "Fintech festival"
```
