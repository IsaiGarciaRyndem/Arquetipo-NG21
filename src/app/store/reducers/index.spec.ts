import { appReducer } from '../app/app.reducer';
import { AppActions } from '../app/app.actions';
import { initialAppSliceState } from '../app/app.models';

describe('store/app reducer', () => {
  it('debe exponer un estado inicial', () => {
    const state = appReducer(undefined, { type: '@@init' } as never);
    expect(state).toEqual(initialAppSliceState);
  });

  it('debe setear ready', () => {
    const state = appReducer(initialAppSliceState, AppActions.setReady({ ready: true }));
    expect(state.ready).toBe(true);
  });
});
