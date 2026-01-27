import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

export function provideShared(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Agrega aquí providers compartidos (por ejemplo, i18n, masker, formatters, etc.)
  ]);
}
