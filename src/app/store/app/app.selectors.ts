import { createFeatureSelector } from '@ngrx/store';

import { AppSliceState } from './app.models';
import { appFeatureKey } from './app.reducer';

export const selectAppState = createFeatureSelector<AppSliceState>(appFeatureKey);
