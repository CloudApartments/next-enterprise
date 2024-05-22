import * as THREE from "three"

export function createG5End() {
  // Create the box geometry
  const geometry = new THREE.BoxGeometry(4.5, 3.3, 7)

  // Create the material
  const material = new THREE.MeshStandardMaterial({ color: "red" })

  // Create the mesh
  const box = new THREE.Mesh(geometry, material)

  return box
}
