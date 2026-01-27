import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AppActions = createActionGroup({
  source: 'App',
  events: {
    Init: emptyProps(),
    'Set Ready': props<{ ready: boolean }>(),
  },
});
