"use client"
import { useEffect, useState } from 'react'
import { upsertZoning } from 'app/api/lib/upserts'
import useZoneomicsAPI from '../api/zoneomics'



export default function ZoneData(props: any) {
  const { address, CloudId } = props
  const [cleanData, setCleanData] = useState({ budgie: "snake" })
  const { data, error, isLoading } = useZoneomicsAPI(address)
  useEffect(() => {
    if (data && !error && !isLoading) {
      const cleanedData = cleanJSON(data).data
      setCleanData(cleanedData)
      cleanedData.CloudId = CloudId
      upsertZoning(cleanedData)
    }
  }, [data, error, isLoading])



  return (<div>
    {cleanData ? <JSONViewer data={cleanData} /> : <div>No Data</div>}
  </div>)
}

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
  // if (newKey.indexOf(" ") === -1) return key
  return newKey
}