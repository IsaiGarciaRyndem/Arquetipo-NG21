import { createReducer, on } from '@ngrx/store';

import { AppActions } from './app.actions';
import { initialAppSliceState } from './app.models';

export const appFeatureKey = 'app' as const;

export const appReducer = createReducer(
  initialAppSliceState,
  on(AppActions.setReady, (state, { ready }) => ({ ...state, ready })),
);
