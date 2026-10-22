/** Estilos compartidos por las pantallas de identidad (tokens del CLAUDE.md §14). */
export const ESTILOS_FORMULARIO = `
  :host { display: block; padding: 20px; max-width: 480px; margin: 0 auto; }
  h1 { margin: 0 0 8px; font-size: 1.25rem; line-height: 1.35; font-weight: 700; }
  p { margin: 0 0 16px; color: var(--color-texto-2); font-size: 0.8125rem; }
  form { display: grid; gap: 14px; }
  label { display: grid; gap: 6px; font-size: 0.8125rem; font-weight: 600; }
  input:not([type='checkbox']), select {
    min-height: 44px; padding: 10px 12px; font: inherit; color: var(--color-texto);
    background: var(--color-superficie); border: 1px solid var(--color-borde);
    border-radius: var(--radio-boton);
  }
  .casilla { display: flex; align-items: flex-start; gap: 12px; min-height: 44px; font-weight: 500; }
  .casilla input { width: 24px; height: 24px; flex: none; margin-top: 2px; }
  .boton {
    min-height: 44px; padding: 10px 16px; font: inherit; font-weight: 600; text-align: center;
    text-decoration: none; color: #fff; background: var(--color-boton-fuerte);
    border: 1px solid var(--color-boton-fuerte); border-radius: var(--radio-boton); cursor: pointer;
  }
  .boton:disabled { opacity: 0.5; cursor: not-allowed; }
  .boton--secundario { color: var(--color-texto); background: var(--color-superficie-2); border-color: var(--color-borde); }
  .error { padding: 10px 12px; font-size: 0.8125rem; color: var(--color-texto);
    background: var(--color-peligro-fondo); border: 1px solid var(--color-peligro);
    border-radius: var(--radio-boton); }
  .ayuda { font-size: 0.75rem; color: var(--color-texto-2); font-weight: 400; }
  .codigo { font-size: 2.375rem; line-height: 1.2; font-weight: 700; letter-spacing: 0.04em; }
  .enlace { color: var(--color-primario); font-weight: 600; }
`;
