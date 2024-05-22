// @ts-nocheck
import React, { useState } from 'react'
const JSONViewer = ({ data, level = 0 }) => {
  const [expanded, setExpanded] = useState({})

  const toggleExpand = key => {
    setExpanded({ ...expanded, [key]: !expanded[key] })
  }

  if (typeof data !== 'object' || data === null) {
    return <div>{data}</div>
  }

  const isTopLevel = level === 0
  const hasChildren = value => typeof value === 'object' && value !== null

  return (
    <div style={{
      display: 'flex',
      flexDirection: isTopLevel ? 'row' : 'column',
      marginLeft: isTopLevel ? '20px' : '10px',
    }}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
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
              minWidth: "200px",
              borderLeft: "1px solid grey",
              borderBottom: "1px solid grey",
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

const normalizeKey = key => {
  const newKey = key
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camel case words
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Add space before the last capital if followed by lower case
    .replace(/^./, str => str.toUpperCase()) // Capitalize the first letter
    .replace(/_/g, ' ') // Replace underscores with spaces
  if (newKey.indexOf(" ") === -1) return key
  return newKey
}

export default JSONViewer
