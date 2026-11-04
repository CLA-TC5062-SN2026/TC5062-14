import 'vitest'

// Tipos del matcher de jest-axe para el `expect` de Vitest.
declare module 'vitest' {
  interface Matchers<T = unknown> {
    toHaveNoViolations(): T
  }
}
