import { create } from "zustand"

export const useZustand = create((set) => ({
  overlay: null,
  mainParcel: [],
  models: [],
  ADD_MODEL: (modelData) =>
    set((state) => {
      const model = JSON.parse(modelData)
      model.position = FromUnityToThreeJS(model.position)
      console.log("PRE ROT", model.rotation)
      model.rotation = unityQuaternionToThreeJSQuaternion(model.rotation) // Convert rotation
      console.log("POST ROT", model.rotation)
      const models = [...state.models, model] // Create a new array
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

function FromUnityToThreeJS(pos) {
  return {
    x: pos.x,
    y: pos.y,
    z: -pos.z,
  }
}

function unityQuaternionToThreeJSQuaternion(unityQuat) {
  return {
    x: unityQuat.x,
    y: -unityQuat.y,
    z: unityQuat.z,
    w: unityQuat.w,
  }
}
