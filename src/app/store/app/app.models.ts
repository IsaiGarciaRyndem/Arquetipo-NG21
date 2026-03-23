export interface AppSliceState {
  /**
   * Bandera simple para demostrar un slice base y facilitar pruebas.
   * Útil para mostrar/hide toolbars, sidebars, etc.
   */
  ready: boolean;
}

export const initialAppSliceState: AppSliceState = {
  ready: false,
};
