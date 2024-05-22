import { create } from "zustand"

export const useZustand = create((set) => ({
  overlay: null,
  mainParcel: [],
  models: [],
  ADD_MODEL: (modelData) =>
    set((state) => {
      const models = [...state.models, JSON.parse(modelData)] // Create a new array
      return { models }
    }),
  SET_MAIN_PARCEL: (parcel) => set({ mainParcel: parcel }),
  adjacentParcels: [],
  ADD_ADJACENT_PARCEL: (parcel) =>
    set((state) => {
      const parcels = [...state.adjacentParcels, parcel]
      return {
        adjacentParcels: parcels,
      }
    }),
  SET_OVERLAY: (ov) => set({ overlay: ov }),
}))
