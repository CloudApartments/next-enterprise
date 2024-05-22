import * as THREE from "three"

export function createG5(position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }, useDegrees = true) {
  // Create the box geometry
  const geometry = new THREE.BoxGeometry(4.5, 3.3, 7)

  // Create the material
  const material = new THREE.MeshStandardMaterial({ color: "orange" })

  // Create the mesh
  const box = new THREE.Mesh(geometry, material)

  // Set the position
  box.position.set(position.x, position.y + 3.3 / 2, position.z)

  // Convert rotation to radians if necessary
  const factor = useDegrees ? Math.PI / 180 : 1
  box.rotation.set(rotation.x * factor, rotation.y * factor, rotation.z * factor)

  return box
}
