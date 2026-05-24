export const state = {
  modoAdmin: false,
  pasosGlobal: [],
  ensenanzasExpandidas: new Set()
};

export function setModoAdmin(isAdmin) {
  state.modoAdmin = isAdmin;
}

export function setPasosGlobal(pasos) {
  state.pasosGlobal = pasos;
}
