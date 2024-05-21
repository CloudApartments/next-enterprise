import create from "zustand"

export const useZustand = create((set) => ({
  overlay: null,
  mainParcel: [],
  SET_MAIN_PARCEL: (parcel) => set({ mainParcel: parcel }),
  SET_OVERLAY: (ov) => set({ overlay: ov }),
  bears: 0, // Initialize bears state
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))
