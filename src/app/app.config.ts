import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideCore } from './core/core.providers';
import { provideShared } from './shared/shared.providers';
import { routes } from './app.routes';
import { provideAppStore } from './store/store.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppStore(),
    provideCore(),
    provideShared(),
  ],
};
