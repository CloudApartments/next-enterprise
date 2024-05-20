'use client'
import { useEffect, useState } from 'react'
import './parcelStyles.css'


import { upsertParcels } from 'app/api/lib/upserts'
import useParcelAPI from "../api/lightbox"

function ParcelData(props: any) {
  const { address, setMapCenter, CloudId } = props
  const [cleanData, setCleanData] = useState({ budgie: "sma,e" })
  const { data, error, isLoading } = useParcelAPI(address)

  useEffect(() => {
    if (data && !error && !isLoading) {
      const cleanedData = cleanJSON(data.parcels[0])
      setCleanData(cleanedData)
      cleanedData.CloudId = CloudId
      upsertParcels(cleanedData)
      const lat = cleanedData.location.representativePoint.latitude
      const lng = cleanedData.location.representativePoint.longitude
      setMapCenter({ lat, lng })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isLoading])


  return (<div>
    {cleanData ? <JSONViewer data={cleanData} /> : <div>No Data</div>}
  </div>)

}

export default ParcelData

const cleanJSON = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(cleanJSON)
  } else if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => !key.startsWith('$'))
        .map(([key, value]) => [key, cleanJSON(value)])
    )
  }
  return data
}


interface JSONViewerProps {
  data: any
  level?: number
}

interface JSONViewerProps {
  data: any
  level?: number
}

const JSONViewer: React.FC<JSONViewerProps> = ({ data, level = 0 }) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})

  const toggleExpand = (key: string) => {
    setExpanded({ ...expanded, [key]: !expanded[key] })
  }

  if (typeof data !== 'object' || data === null) {
    return <div>{data}</div>
  }

  const isTopLevel = level === 0
  const hasChildren = (value: any) => typeof value === 'object' && value !== null

  return (
    <div style={{
      display: 'flex',
      flexDirection: isTopLevel ? 'row' : 'column',
      marginLeft: isTopLevel ? '20px' : '10px',
    }}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} >
          <div
            onClick={() => hasChildren(value) && toggleExpand(key)}
            style={{
              fontWeight: hasChildren(value) ? 'bold' : 'normal',
              background: isTopLevel ? '#f0f0f0' : 'none',
              cursor: hasChildren(value) ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: "10px",
              minWidth: "200px"
            }}
          >
            {normalizeKey(key)} {hasChildren(value) && (expanded[key] ? '▼' : '▶')}
          </div>
          {hasChildren(value) && expanded[key] && (
            <JSONViewer data={value} level={level + 1} />
          )}
          {!hasChildren(value) && <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>{value?.toString()}</div>}
        </div>
      ))}
    </div>
  )
}



const normalizeKey = (key: string): string => {
  const newKey = key
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camel case words
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Add space before the last capital if followed by lower case
    .replace(/^./, str => str.toUpperCase()) // Capitalize the first letter
    .replace(/_/g, ' ') // Replace underscores with spaces
  if (newKey.indexOf(" ") === -1) return key
  return newKey
}