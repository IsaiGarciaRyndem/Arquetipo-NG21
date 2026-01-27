import { createStorageSyncMetaReducer } from './storage-sync.meta-reducer';

describe('storageSync meta-reducer', () => {
  it('debe hidratar y persistir', () => {
    const storage = (() => {
      const map = new Map<string, string>();
      return {
        getItem: (k: string) => map.get(k) ?? null,
        setItem: (k: string, v: string) => {
          map.set(k, v);
        },
        removeItem: (k: string) => {
          map.delete(k);
        },
      };
    })();

    storage.setItem('test', JSON.stringify({ ready: true }));

    interface S {
      ready: boolean;
    }

    const reducer = (state: S | undefined, action: { type: string }): S => {
      if (!state) return { ready: false };
      if (action.type === 'SET') return { ready: true };
      return state;
    };

    const meta = createStorageSyncMetaReducer<S>({ storageKey: 'test', storage });

    const wrapped = meta(reducer);

    const state1 = wrapped(undefined, { type: '@@init' });
    expect(state1.ready).toBe(true);

    const state2 = wrapped(state1, { type: 'SET' });
    expect(state2.ready).toBe(true);
    expect(JSON.parse(storage.getItem('test')!)).toEqual({ ready: true });
  });
});
