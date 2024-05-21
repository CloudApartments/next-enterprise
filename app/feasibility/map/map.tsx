import { Shape, ShapeGeometry, Mesh, MeshBasicMaterial, DoubleSide, Vector3, Euler } from 'three'
import { Loader } from "@googlemaps/js-api-loader"
import { ThreeJSOverlayView } from "@googlemaps/three"
import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react"
import * as THREE from 'three'
import { useZustand } from 'app/api/zustand'

const apiOptions = {
  apiKey: "AIzaSyAidlspu6dFlmcHyOP9vHAUbtGF9WqA7i0",
  libraries: ["places", "geometry"],
  callback: () => {
    alert("buffalo")
  },
}

async function loadMap() {
  const apiLoader = new Loader(apiOptions)
  return await apiLoader.load()
}

const GoogleMap: React.FC<{ mapCenter: google.maps.LatLngLiteral }> = ({ mapCenter }): ReactElement => {
  const { SET_OVERLAY, overlay: globalOverlay, mainParcel } = useZustand()
  const [google, setGoogle] = useState<any>(null)
  const [map, setMap] = useState<any>(null)
  const [vertices, setVertices] = useState<Vector3[]>(mainParcel)
  const overlay = useRef<any>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef(new THREE.Vector2())

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

      map.addListener("mousemove", (ev) => {
        const { domEvent } = ev
        const { left, top, width, height } = mapDiv.getBoundingClientRect()
        const x = domEvent.clientX - left
        const y = domEvent.clientY - top
        mousePosition.current.x = 2 * (x / width) - 1
        mousePosition.current.y = 1 - 2 * (y / height)
        overlay.current.requestRedraw()
      })

      let highlightedObject: THREE.Mesh | null = null
      const DEFAULT_COLOR = 0x00ff00
      const HIGHLIGHT_COLOR = 0xff0000

      const onClick = () => {
        const intersections = overlay.current.raycast(mousePosition.current)
        if (highlightedObject) {
          highlightedObject.material.color.setHex(DEFAULT_COLOR)
        }
        if (intersections.length > 0) {
          highlightedObject = intersections[0].object
          highlightedObject.material.color.setHex(HIGHLIGHT_COLOR)
        }
        overlay.current.requestRedraw()
      }

      map.addListener('mousedown', onClick)
      SET_OVERLAY(overlay.current)
      return () => {
        google.maps.event.clearListeners(map, 'mousedown')
        google.maps.event.clearListeners(map, 'mousemove')
      }
    }
  }, [map, mapCenter, google])

  useEffect(() => {
    if (globalOverlay && vertices.length > 0) {
      const scene = globalOverlay.scene

      // Remove previous shape
      while (scene.children.length > 0) {
        scene.remove(scene.children[0])
      }

      // Prepare points from vertices
      const points = vertices.map(vertex => new THREE.Vector3(vertex.x, vertex.y, vertex.z))

      // Create clickable shape
      const shape = makeClickableShape({
        id: 'shapeId',  // Replace with appropriate ID
        points: points,
        parcelId: 'parcelId'  // Replace with appropriate parcel ID
      })

      // Add shape to the scene
      scene.add(shape)
      globalOverlay.requestRedraw()
    }
  }, [vertices, globalOverlay, mainParcel])

  return (
    <div>
      <div
        id="map"
        ref={mapRef}
        style={{ height: "99vh", width: "100%", marginBottom: "28px" }}
      />
      <button onClick={() => setVertices(mainParcel)}>DRAW</button>
    </div>
  )
}

export default GoogleMap
const makeClickableShape = (props: {
  id: any,
  points: Vector3[],
  parcelId: string
}) => {
  const { parcelId, points } = props
  let customShape = new Shape()
  points.forEach((point: Vector3, index: number) => {
    if (index === 0) {
      customShape.moveTo(point.x, point.z)
    } else {
      customShape.lineTo(point.x, point.z)
    }
  })
  customShape.lineTo(points[0].x, points[0].z) // Close the shape

  let geometry = new ShapeGeometry(customShape)
  let material = new MeshBasicMaterial({
    color: "rgb(69,71,86)",
    side: DoubleSide,
    transparent: true,
    opacity: 1,
  })
  const shape: Mesh = new Mesh(geometry, material)
  shape.userData = { id: parcelId, type: "parcel" }
  // Remove the rotation adjustment
  // shape.rotation.setFromVector3(new Vector3(Math.PI / 2, 0, 0))
  return shape
}
