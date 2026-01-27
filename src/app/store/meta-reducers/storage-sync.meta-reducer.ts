import { ActionReducer, MetaReducer } from '@ngrx/store';

export interface StorageSyncOptions<T> {
  storageKey: string;
  /**
   * Guarda solo parte del estado.
   * Por defecto persiste todo el estado que reciba el meta-reducer.
   */
  selectState?: (state: T) => unknown;
  /**
   * Rehidrata el estado al arrancar.
   * El resultado debe ser compatible con el state del reducer raíz.
   */
  merge?: (hydrated: unknown, state: T | undefined) => T;
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
}

/**
 * Persistencia/rehidratación super ligera vía localStorage.
 * - No serializa funciones.
 * - Pensado para un bootstrap rápido del arquetipo.
 */
export function createStorageSyncMetaReducer<T extends object>(
  options: StorageSyncOptions<T>,
): MetaReducer<T> {
  const {
    storageKey,
    selectState,
    merge,
    storage = typeof localStorage !== 'undefined' ? localStorage : undefined,
  } = options;

  return (reducer: ActionReducer<T>): ActionReducer<T> => {
    let hasHydrated = false;

    return (state, action) => {
      // 1) Hydrate once
      if (!hasHydrated && storage) {
        hasHydrated = true;
        try {
          const raw = storage.getItem(storageKey);
          if (raw) {
            const hydrated = JSON.parse(raw) as unknown;
            state = merge ? merge(hydrated, state) : (hydrated as T);
          }
        } catch {
          // ignore
        }
      }

      // 2) Reduce
      const nextState = reducer(state, action);

      // 3) Persist
      if (storage) {
        try {
          const toPersist = selectState ? selectState(nextState) : nextState;
          storage.setItem(storageKey, JSON.stringify(toPersist));
        } catch {
          // ignore
        }
      }

      return nextState;
    };
  };
}
