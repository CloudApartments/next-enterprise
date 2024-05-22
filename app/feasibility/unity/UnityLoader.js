"use client"
import { useEffect } from "react"
import { Unity, useUnityContext } from "react-unity-webgl"
import { useZustand } from "app/api/zustand"
export default function UnityCloud() {
  const { mainParcel, ADD_MODEL } = useZustand()
  function DrawMainParcel() {
    sendMessage("DnDMessenger", "DrawMainParcel", JSON.stringify(mainParcel))
  }
  const { unityProvider, sendMessage, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: "/Build/unity.loader.js",
    dataUrl: "/Build/unity.data",
    frameworkUrl: "/Build/unity.framework.js",
    codeUrl: "/Build/unity.wasm",
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
