import { ActionReducer, MetaReducer } from '@ngrx/store';

/**
 * Meta-reducer de logging sencillo.
 * Se activa solo en dev (ver wiring en `reducers/index.ts`).
 */
export function loggerMetaReducer<T extends object>(reducer: ActionReducer<T>): ActionReducer<T> {
  return (state, action) => {
    console.log('[store]', action.type, action);
    return reducer(state, action);
  };
}

export const loggerMetaReducerFactory: MetaReducer = (reducer) => loggerMetaReducer(reducer);
