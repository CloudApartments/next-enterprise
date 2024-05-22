import { ThreeJSOverlayView, latLngToVector3 } from "@googlemaps/three"
import { Canvas, useFrame } from "@react-three/fiber"
import { Map, useMap } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

const ThreeMap = (props: any) => {
  const map = useMap()
  const { lat, lng } = props.mapCenter
  // const [scene, setScene] = useState()
  const [overlay, setOverlay] = useState()
  useEffect(() => {
    if (map && !overlay) {

      const ov = new ThreeJSOverlayView({
        // @ts-ignore
        map,
        upAxis: "Y",
        anchor: props.mapCenter,

      })
      // @ts-ignore
      setOverlay(ov)
    }
  }, [map, overlay, props.mapCenter])

  return (
    <div>
      <Map
        style={{ width: '80vw', height: '100vh' }}
        gestureHandling={'cooperative'}
        disableDefaultUI={true}
        mapId={"5c3ca4ce7762c0dc"}
        // @ts-ignore
        center={{ lat, lng, height: 0 }}
        defaultZoom={18}
        defaultTilt={90}
      // clickableIcons={false}

      />
    </div>
  )
}

export default ThreeMap
