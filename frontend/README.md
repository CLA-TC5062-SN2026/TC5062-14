# UnCalificado: frontend web

SPA de UnCalificado construida con **React + Vite + TypeScript**, con estilos en **CSS Modules**, estado con **`useState` + Context API** y comunicación HTTP con **Fetch API**. La justificación del stack está en [`../S07_S08_A1/decision_stack_frontend.md`](../S07_S08_A1/decision_stack_frontend.md), una propuesta que el equipo todavía debe revisar.

Estado actual: **Parte 3 de S07-S08-A1** (evaluación de accesibilidad). La pantalla principal (`DemoComponentesPage`) es una **vista previa del producto**: propósito de UnCalificado, «Cómo funcionará», oficios y zona del piloto, solicitudes de ejemplo y formulario de inicio de sesión. Al final incluye una sección técnica que muestra Button, InputField, Card y Navbar en sus distintos estados. Usa **datos de ejemplo** y no se conecta al backend.

## Requisitos

- **Node.js `^22.22.2 || ^24.15.0 || >=26.0.0`** (campo `engines` de `package.json`). Este rango es la intersección de los requisitos que declaran las dependencias instaladas:

  | Dependencia | Node.js requerido |
  |---|---|
  | `vite` 8.3, `@vitejs/plugin-react` 6.2 | `^20.19.0 \|\| >=22.12.0` |
  | `eslint` 10.14 | `^20.19.0 \|\| ^22.13.0 \|\| >=24` |
  | `vitest` 5.1 | `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0` |
  | `@testing-library/jest-dom` 7.0 | `>=22` |
  | `undici` 8.12 (dependencia de jsdom) | `>=22.19.0` |
  | `jsdom` 30.1 (y `@asamuzakjp/*`, `w3c-xmlserializer`) | `^22.22.2 \|\| ^24.15.0 \|\| >=26.0.0` |

  Node 20 alcanza para `dev`, `build` y `lint`, pero no para `npm run test`. npm solo advierte cuando la versión no cumple `engines`; no bloquea la instalación.
- **Nota sobre el entorno de desarrollo:** el proyecto se generó y probó con Node 24.11.1 y npm 11.6.2. Esa versión **queda por debajo** del mínimo que declara jsdom (24.15.0). Las 41 pruebas pasaron, pero en una versión no soportada oficialmente; se recomienda usar Node 24.15 o posterior.
- Opcional: el backend Flask de la rama `feature/s05-s06-a2-auth`, en `http://localhost:5000`. La pantalla inicial funciona sin él.

## Puesta en marcha

```bash
cd frontend
npm install
cp .env.example .env.local   # opcional: los valores por defecto ya apuntan a /api y localhost:5000
npm run dev                  # http://localhost:5173
```

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente y proxy `/api` hacia Flask |
| `npm run build` | Verificación de tipos (`tsc -b`) y compilación de producción en `dist/` |
| `npm run preview` | Sirve localmente el contenido de `dist/` |
| `npm run typecheck` | Solo la verificación de tipos |
| `npm run lint` | ESLint (reglas de JS, TypeScript, React Hooks y React Refresh) |
| `npm run test` | Pruebas con Vitest, Testing Library y jest-axe (jsdom) |
| `npm run test:watch` | Pruebas en modo observación |

## Pruebas

Las pruebas (`*.test.tsx`) están junto a cada componente. `src/test/setup.ts` registra jest-dom y el matcher `toHaveNoViolations`, y `src/test/axe.ts` limita axe a las reglas de WCAG 2.0 y 2.1, niveles A y AA. En jsdom no se puede evaluar el contraste de color; por eso el contraste y las comprobaciones de diseño se hicieron en un navegador real (ver [`../S07_S08_A1/accesibilidad.md`](../S07_S08_A1/accesibilidad.md)). Una prueba axe aprobada no garantiza el cumplimiento de WCAG.

## Variables de entorno

| Variable | Valor por defecto | Uso |
|---|---|---|
| `VITE_API_URL` | `/api` | Prefijo de la API para el cliente HTTP. Queda incluida en el código del navegador, así que no debe contener secretos. |
| `BACKEND_PROXY_TARGET` | `http://localhost:5000` | Destino del proxy de desarrollo. Solo la lee `vite.config.ts`. |

## Integración con el backend

- El backend de la rama de autenticación no configura CORS. En desarrollo, el servidor de Vite reenvía `/api/*` a Flask conservando la ruta (por ejemplo, `/api/auth/login` → `http://localhost:5000/api/auth/login`). En producción, Nginx sirve la SPA y la API bajo el mismo dominio (AR-05).
- Las rutas están centralizadas en `src/services/endpoints.ts`. Solo se incluyen las que **ya están implementadas** en el backend: `/health`, `/auth/register`, `/auth/login`, `/auth/me`, `/solicitudes` y `/casos-soporte`.
- `src/services/httpClient.ts` agrega `Authorization: Bearer <token>` cuando recibe un token y convierte las respuestas de error `{codigo, mensaje, errores?}` en `ApiError`. Los errores generados por el propio cliente usan el prefijo `CLIENTE_` para distinguirlos de los códigos del backend.
- El token se guarda solo en memoria (`src/context/AuthProvider.tsx`), así que recargar la página cierra la sesión.

## Estructura

```
frontend/
├── index.html              # documento base (lang="es-MX")
├── vite.config.ts          # plugin React, CSS Modules, proxy /api
├── eslint.config.js
├── .env.example
├── public/favicon.svg
└── src/
    ├── main.tsx            # punto de entrada; envuelve la app en <AuthProvider>
    ├── App.tsx
    ├── index.css           # variables de diseño, reinicio y foco visible
    ├── vite-env.d.ts       # tipos de import.meta.env
    ├── components/         # Button/, InputField/, Card/, Navbar/ (tsx + module.css + index.ts)
    ├── pages/
    │   ├── DemoComponentes/ # pantalla principal (vista previa del producto, datos de ejemplo):
    │   │                    #   DemoComponentesPage, FormularioLoginDemo, DemostracionComponentes,
    │   │                    #   contenidoProducto (textos con referencias al SRS), datosFicticios
    │   └── InicioPage.tsx   # pantalla del scaffolding (Parte 1), sin uso actualmente
    ├── utils/              # catálogos de etiquetas, formato es-MX, validación del login
    ├── test/               # setup de Vitest, configuración de axe y tipos del matcher
    ├── services/           # apiTypes, endpoints, httpClient, authService
    └── context/            # AuthContext, AuthProvider, useAuth
```
