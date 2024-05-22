import { Loader } from "@googlemaps/js-api-loader"
import { ThreeJSOverlayView } from "@googlemaps/three"
import React, { useCallback, useEffect, useRef, useState } from "react"
import * as THREE from 'three'
import { useZustand } from 'app/api/zustand'
import { createG5 } from "../3d/G5"
import { drawShapes } from '../3d/threeUtils'

const apiOptions = {
  apiKey: "AIzaSyAidlspu6dFlmcHyOP9vHAUbtGF9WqA7i0",
  libraries: ["places", "geometry"],
}

async function loadMap(): Promise<typeof google> {
  // @ts-ignore
  const apiLoader = new Loader(apiOptions)
  return await apiLoader.load()
}

interface GoogleMapProps {
  mapCenter: google.maps.LatLngLiteral
}

const GoogleMap: React.FC<GoogleMapProps> = ({ mapCenter }) => {
  const { SET_OVERLAY, overlay: globalOverlay, mainParcel, adjacentParcels, models } = useZustand()
  const [google, setGoogle] = useState<any>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [vertices, setVertices] = useState<THREE.Vector3[]>(mainParcel)
  const [adJacentVertices, setAdjacentVertices] = useState<THREE.Vector3[][]>([])
  const overlay = useRef<ThreeJSOverlayView | null>(null)
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mousePosition = useRef(new THREE.Vector2())

  const getGoogle = useCallback(async () => {
    const google = await loadMap()
    setGoogle(google)
  }, [])

  useEffect(() => {
    console.log("MODELINNNNGGGGG")
    // @ts-ignore
    models.forEach((model) => {
      const g5 = createG5(model.position, model.rotation)
      globalOverlay?.scene.add(g5)
    })
    globalOverlay?.requestRedraw()
  }, [globalOverlay, globalOverlay?.scene, models])
  useEffect(() => {
    getGoogle()
  }, [getGoogle])

  useEffect(() => {
    if (google && !map) {
      const mapOptions: google.maps.MapOptions = {
        mapId: "5c3ca4ce7762c0dc",
        disableDoubleClickZoom: true,
        gestureHandling: "cooperative",
        center: mapCenter,
        zoom: 19.5,
        tilt: 90,
        clickableIcons: false,
      }
      const mapInstance = new google.maps.Map(mapRef.current!, mapOptions)
      setMap(mapInstance)
    }
  }, [google, map, mapCenter])

  useEffect(() => {
    if (map && !overlay.current) {
      const scene = new THREE.Scene()
      overlay.current = new ThreeJSOverlayView({
        map,
        upAxis: "Y",
        anchor: mapCenter,
        scene,
      })

      const mapDiv = map.getDiv()

      map.addListener("mousemove", (ev: google.maps.MapMouseEvent) => {
        const { domEvent } = ev
        const { left, top, width, height } = mapDiv.getBoundingClientRect()
        // @ts-ignore
        const x = domEvent.clientX - left
        // @ts-ignore
        const y = domEvent.clientY - top
        mousePosition.current.x = 2 * (x / width) - 1
        mousePosition.current.y = 1 - 2 * (y / height)
        overlay.current!.requestRedraw()
      })

      const onClick = () => {
        overlay.current!.requestRedraw()
      }

      map.addListener('mousedown', onClick)
      SET_OVERLAY(overlay.current)
      return () => {
        google.maps.event.clearListeners(map, 'mousedown')
        google.maps.event.clearListeners(map, 'mousemove')
      }
    }
  }, [map, mapCenter, google, SET_OVERLAY])

  useEffect(() => {
    if (globalOverlay && vertices.length > 0) {
      const scene = globalOverlay.scene
      drawShapes(scene, [vertices], 'mainShapeId', 'mainParcelId')
      globalOverlay.requestRedraw()
    }
  }, [vertices, globalOverlay, mainParcel])

  useEffect(() => {
    if (globalOverlay && adJacentVertices && adJacentVertices.length > 0) {
      const scene = globalOverlay.scene
      drawShapes(scene, adJacentVertices, 'adjacentShapeId', 'adjacentParcelId', "rgba(99,101,116,.1)")
      globalOverlay.requestRedraw()
    }
  }, [adJacentVertices, globalOverlay])

  return (
    <div>
      <button onClick={() => {
        setVertices(mainParcel)
        setAdjacentVertices(adjacentParcels)
        globalOverlay!.scene.add(createG5())
        globalOverlay!.requestRedraw()
      }}>DRAW</button>
      <div
        id="map"
        ref={mapRef}
        style={{ height: "99vh", width: "100%", marginBottom: "28px" }}
      />
    </div>
  )
}

export default GoogleMap
