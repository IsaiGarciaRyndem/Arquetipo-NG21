import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { AppSliceState } from '../app/app.models';
import { appFeatureKey, appReducer } from '../app/app.reducer';
import { loggerMetaReducerFactory } from '../meta-reducers/logger.meta-reducer';
import { createStorageSyncMetaReducer } from '../meta-reducers/storage-sync.meta-reducer';

/**
 * Estado raíz del Store.
 * Agrega aquí nuevos slices conforme crezca el proyecto.
 */
export interface AppState {
  [appFeatureKey]: AppSliceState;
  router: RouterReducerState;
}

export const reducers: ActionReducerMap<AppState> = {
  [appFeatureKey]: appReducer,
  router: routerReducer,
};

export const metaReducers: MetaReducer<AppState>[] = isDevMode()
  ? [loggerMetaReducerFactory]
  : [
      /**
       * Persistencia opcional.
       * Si la habilitas, considera persistir solo slices específicos.
       */
      createStorageSyncMetaReducer<AppState>({
        storageKey: 'app-state',
        selectState: (s) => ({ app: s.app }),
      }),
    ];
