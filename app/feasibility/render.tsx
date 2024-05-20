'use client'
import * as React from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import GoogleMap from './map/map'
import ParcelData from './panels/ParcelData'
import ZoneData from './panels/ZoneData'


export default function FeasibilityRenderer() {
  const [mapCenter, setMapCenter] = useState()
  const address = '12358 Carmel Country Rd, San Diego, CA'
  const id = uuidv4()
  return (
    <div>
      <div>FEASIBILITY</div>
      <header>Parcel Data</header>
      <ParcelData address={address} setMapCenter={setMapCenter} CloudId={id} />
      <header>Zoning Data</header>
      <ZoneData address={address} CloudId={id} />
      {mapCenter && <GoogleMap mapCenter={mapCenter} />}
    </div>
  )
}
