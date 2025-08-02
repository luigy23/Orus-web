// src/atoms/ubicacionAtom.js
import { atomWithStorage } from "jotai/utils";

// Almacena la ciudad seleccionada para búsquedas (puede ser diferente a la del usuario)
export const ciudadBusquedaAtom = atomWithStorage("ciudadBusqueda", null);

// Almacena información completa de la ciudad seleccionada para búsquedas
export const ciudadBusquedaInfoAtom = atomWithStorage("ciudadBusquedaInfo", null);
