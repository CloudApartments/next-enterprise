"use client"
import { useEffect } from "react"
import { Unity, useUnityContext } from "react-unity-webgl"
import { useZustand } from "app/api/zustand"
export default function UnityCloud() {
  const { mainParcel, ADD_MODEL } = useZustand()
  function DrawMainParcel() {
    const transformedParcel = mainParcel.map((coord) => threeJsToUnity(coord))
    sendMessage("DnDMessenger", "DrawMainParcel", JSON.stringify(transformedParcel))
  }
  const { unityProvider, sendMessage, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: "/Unity/Build/unity.loader.js",
    dataUrl: "/Unity/Build/unity.data",
    frameworkUrl: "/Unity/Build/unity.framework.js",
    codeUrl: "/Unity/Build/unity.wasm",
  })

  useEffect(() => {
    addEventListener("AddModel", ADD_MODEL)
    return () => {
      removeEventListener("AddModel", ADD_MODEL)
    }
  }, [addEventListener, removeEventListener, ADD_MODEL])

  return (
    <>
      <button onClick={DrawMainParcel}>Spawn Enemies</button>
      <Unity unityProvider={unityProvider} style={{ height: `90vh`, width: `90vw` }} id="unity-canvas-id" />
    </>
  )
}
function threeJsToUnity(threeJsVector) {
  return {
    x: threeJsVector.x,
    y: threeJsVector.y,
    z: -threeJsVector.z,
  }
}
