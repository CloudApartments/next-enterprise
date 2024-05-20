'use client'

import { APIProvider, } from '@vis.gl/react-google-maps'
import GoogleMap from './render'

const Map = (props: any) => {

  return (
    <APIProvider apiKey={"AIzaSyAidlspu6dFlmcHyOP9vHAUbtGF9WqA7i0"} libraries={["places", "geometry"]}>
      <GoogleMap mapCenter={props.mapCenter} />
    </APIProvider>
  )
}

export default Map