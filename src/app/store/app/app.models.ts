export interface AppSliceState {
  /**
   * Bandera simple para demostrar un slice base y facilitar pruebas.
   * Útil para mostrar/hide toolbars, sidebars, etc.
   */
  appTitle: string;
}

export const initialAppSliceState: AppSliceState = {
  appTitle: '',
};
