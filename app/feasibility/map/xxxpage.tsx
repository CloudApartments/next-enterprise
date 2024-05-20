

'use client'

import React, { ReactElement, useCallback, useEffect, useRef, useState, Suspense } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { Canvas } from "@react-three/fiber"

const apiOptions = {
  apiKey: "AIzaSyAidlspu6dFlmcHyOP9vHAUbtGF9WqA7i0",
  libraries: ["places", "geometry"],
  callback: () => {
    alert("buffalo")
  },
}

const mapCenter = {
  lat: 37.34376589426541,
  lng: -121.9308962600858,
}

async function loadMap() {
  // @ts-ignore
  const apiLoader = new Loader(apiOptions)
  return await apiLoader.load()
}

const ContainerWGO: React.FC = (): ReactElement => {
  const [google, setGoogle] = useState<any>(null)
  const [map, setMap] = useState<any>(null)
  const mapRef = useRef(null)
  const canvasRef = useRef<any>()
  const [dpr, setDpr] = useState(1.5)

  const getGoogle = useCallback(async () => {
    const google = await loadMap()
    setGoogle(google)
  }, [])

  useEffect(() => {
    getGoogle()
  }, [getGoogle])

  useEffect(() => {
    if (google && !map) {
      const mapOptions = {
        mapId: "5c3ca4ce7762c0dc",
        disableDoubleClickZoom: true,
        gestureHandling: "cooperative",
        center: mapCenter,
        zoom: 18,
        tilt: 55,
        clickableIcons: false,
        pixelRatio: 1,
        scrollWheel: false,
        dragging: false,
      }
      const mapInstance = new google.maps.Map(mapRef.current, mapOptions)
      setMap(mapInstance)
    }
  }, [google, map])

  return (
    <div>
      <div
        id="map"
        ref={mapRef}
        style={{ height: "99vh", width: "100%", marginBottom: "28px" }}
      >
        <Canvas
          id="map-canvas"
          ref={canvasRef}
          frameloop="demand"
          style={{ transform: "translateZ(0)" }}
        >
          <ambientLight intensity={0.1} />
          <directionalLight position={[1, 1, 5]} intensity={1} />
        </Canvas>
      </div>
    </div>
  )
}

export default ContainerWGO
