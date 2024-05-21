import * as turf from "@turf/turf"
import proj4 from "proj4"
import wellknown from "wellknown"

export function convertGeoJsonToRelative(geoJson, sourceProj = "EPSG:4326", destProj = "EPSG:3857", referencePoint) {
  const coordinates = geoJson.coordinates
  const projectedReferencePoint = proj4(sourceProj, destProj, referencePoint)

  function projectCoordinates(coords) {
    if (Array.isArray(coords[0])) {
      return coords.map((subCoords) => projectCoordinates(subCoords))
    } else {
      const projectedCoord = proj4(sourceProj, destProj, coords)
      return [projectedCoord[0] - projectedReferencePoint[0], projectedCoord[1] - projectedReferencePoint[1]]
    }
  }

  const projectedCoordinates = projectCoordinates(coordinates)

  return projectedCoordinates
}
export function convertToXYZ(wktInput) {
  const geojson = wellknown.parse(wktInput)
  return geojson
}

export function cleanJSON(data) {
  if (Array.isArray(data)) {
    return data.map(cleanJSON)
  } else if (data !== null && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => !key.startsWith("$"))
        .map(([key, value]) => [key, cleanJSON(value)])
    )
  }
  return data
}

export const wgs84 = "EPSG:4326"
export const metricProj = "+proj=utm +zone=10 +datum=WGS84 +units=m +no_defs"
