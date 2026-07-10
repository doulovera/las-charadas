# Las Charadas

Juego de charadas en español construido con Expo SDK 54. La primera versión está enfocada en iPhone, funciona sin cuentas ni servidor y adapta las tarjetas a la región elegida.

## Qué incluye

- Onboarding que detecta la región configurada en el iPhone y permite cambiarla.
- Perú, México, Argentina, Colombia, Chile, Venezuela, España y español general.
- Cuatro mazos locales con variantes como `canchita`, `palomitas`, `pochoclo`, `crispetas` o `cabritas`.
- Rondas de 30, 60 o 90 segundos.
- Juego horizontal con calibración y gestos para correcto/pasar.
- Botones táctiles grandes como alternativa a los sensores.
- Respuesta visual, sonora y háptica.
- Resumen de resultados e historial local de las últimas 20 rondas.
- Preferencias y contenido disponibles completamente offline.

## Ejecutar en iOS

Requiere Node.js, pnpm, Xcode y un simulador de iPhone o un iPhone con Expo Go.

```bash
pnpm install
pnpm ios
```

Para abrirlo en un iPhone físico con Expo Go, inicia Metro y escanea el QR:

```bash
pnpm start
```

Los comandos predeterminados inician Expo en modo offline. Esto evita la consulta remota de metadatos que no es necesaria para desarrollar localmente y que puede mostrar un HTTP 500 `UnexpectedServerData`. `pnpm ios:online` queda disponible para instalar la versión correcta de Expo Go en un simulador nuevo.

El simulador sirve para revisar la interfaz y los botones. Los gestos y la vibración deben probarse en un iPhone físico.

## Comprobaciones

```bash
pnpm typecheck
pnpm doctor
pnpm exec expo export --platform ios --output-dir dist
```

## Estructura

- `App.tsx`: estado de navegación y ciclo principal.
- `src/screens`: onboarding, inicio, preparación, tutorial, juego, resultados y ajustes.
- `src/data/decks.ts`: mazos y variantes regionales.
- `src/lib/storage.ts`: preferencias e historial en AsyncStorage.
- `assets/sounds`: sonidos cortos incluidos en la app.
- `specs/plan.html`: documento de producto original.

No hay backend. Si el contenido necesita actualizarse con frecuencia, el siguiente paso previsto es un manifiesto estático versionado que mantenga una copia local utilizable sin conexión.
