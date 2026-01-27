import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

export function provideCore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Agrega aquí providers globales de Core (interceptors, guards, servicios singleton, etc.)
  ]);
}
