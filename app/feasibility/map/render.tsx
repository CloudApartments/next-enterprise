import { ThreeJSOverlayView, latLngToVector3 } from "@googlemaps/three"
import { Canvas, useFrame } from "@react-three/fiber"
import { Map, useMap } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

const App = (props: any) => {
  const map = useMap()
  const { lat, lng } = props.mapCenter
  const [scene, setScene] = useState()
  const [overlay, setOverlay] = useState()
  useEffect(() => {
    if (map && scene && !overlay) {

      const ov = new ThreeJSOverlayView({
        // @ts-ignore
        map,
        upAxis: "Y",
        anchor: props.mapCenter,
        scene
      })
      // @ts-ignore
      setOverlay(ov)
    }
  }, [map, overlay, props.mapCenter, scene])

  return (
    <div>
      <Map
        style={{ width: '100vw', height: '100vh' }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={"5c3ca4ce7762c0dc"}
        // @ts-ignore
        center={{ lat, lng, height: 0 }}
        zoom={18}
        tilt={55}
      />
      <Canvas
        onCreated={({ scene }) => {
          // @ts-ignore
          setScene(scene)
        }}>
        <ambientLight />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[0, 50, 50]} overlay={overlay} />
      </Canvas>
    </div>
  )
}

export default App


function Box(props: any) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    // @ts-ignore
    (meshRef.current.rotation.x += delta)
    props.overlay?.requestRedraw()
  })
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => {
        alert("BUDGIE")
        setActive(!active)
      }}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[10, 10, 10]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}