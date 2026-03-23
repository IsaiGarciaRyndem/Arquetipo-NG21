import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { environment } from '@env/environment';
import { metaReducers, reducers } from './reducers';

export function provideAppStore(): EnvironmentProviders {
  const devtoolsProviders: EnvironmentProviders[] = !environment.production
    ? [
        provideStoreDevtools({
          name: 'MiApp',
          maxAge: 50,
          logOnly: false,
          trace: true,
          traceLimit: 25,
        }),
      ]
    : [];

  return makeEnvironmentProviders([
    ...devtoolsProviders,
    provideStore(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
    provideRouterStore(),
  ]);
}
