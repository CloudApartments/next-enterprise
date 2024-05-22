'use client'
import * as React from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import GoogleMap from './map/map'
import ParcelData from './panels/ParcelData'
import ZoneData from './panels/ZoneData'
import UnityCloud from "./unity/UnityLoader"

export default function FeasibilityRenderer() {
  const [mapCenter, setMapCenter] = useState()
  const address = '7 Top Golf Drive, San Jose, CA'
  // const address = '2165 Alameda, San Jose, CA'
  // const address = '851 Manhattan Place, Los Angeles, CA'
  // const address = '1331 El Camino Real, Redwood City, CA'
  const id = uuidv4()

  return (
    <div>
      <div>FEASIBILITY</div>
      <header>Parcel Data</header>
      <ParcelData address={address} setMapCenter={setMapCenter} CloudId={id} />
      <header>Zoning Data</header>
      <ZoneData address={address} CloudId={id} />
      {mapCenter && <GoogleMap mapCenter={mapCenter} />}
      <div style={{ width: '100vw', height: '100vh' }}>
        <UnityCloud /></div>
    </div>
  )
}
