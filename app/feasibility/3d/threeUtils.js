import * as THREE from "three"

export const makeClickableShape = (props) => {
  const { parcelId, points, color } = props
  let customShape = new THREE.Shape()
  points.forEach((point, index) => {
    if (index === 0) {
      customShape.moveTo(point.x, point.z) // Use x and y for the shape
    } else {
      customShape.lineTo(point.x, point.z) // Use x and y for the shape
    }
  })
  customShape.lineTo(points[0].x, points[0].z) // Close the shape

  let geometry = new THREE.ShapeGeometry(customShape)
  let material = new THREE.MeshBasicMaterial({
    color: color || "rgba(69,71,86,.1)",
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
  })
  const shape = new THREE.Mesh(geometry, material)

  // Create border
  const borderGeometry = new THREE.EdgesGeometry(geometry)
  const borderMaterial = new THREE.LineBasicMaterial({ color: 0x999999 }) // Black color for border
  const border = new THREE.LineSegments(borderGeometry, borderMaterial)

  shape.userData = { id: parcelId, type: "parcel" }
  // Ensure shape is positioned correctly on the ground
  shape.position.y = 0

  const group = new THREE.Group()
  group.add(shape)
  group.add(border)
  group.rotateX(Math.PI / 2)

  return group
}

export const drawShapes = (scene, verticesGroups, shapeId, parcelId, color, position, rotation) => {
  verticesGroups.forEach((vertices) => {
    const points = vertices.map((vertex) => new THREE.Vector3(vertex.x, vertex.y, vertex.z))

    // Create clickable shape
    const shape = makeClickableShape({
      id: shapeId, // Replace with appropriate ID
      points: points,
      parcelId: parcelId, // Replace with appropriate parcel ID
      color: color,
    })

    // Set position and rotation if provided
    if (position) {
      shape.position.set(position.x, position.y, position.z)
    }
    if (rotation) {
      shape.rotation.set(rotation.x, rotation.y, rotation.z)
    }

    // Add shape to the scene
    scene.add(shape)
  })
}
