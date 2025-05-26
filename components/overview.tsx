"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"

interface DataItem {
  date: string
  profit: number
}

interface OverviewProps {
  data: DataItem[]
}

const Overview: React.FC<OverviewProps> = ({ data }) => {
  const [chartData, setChartData] = useState<any[]>([])

  // Move any data transformations to memoized values or effects
  const memoizedChartData = useMemo(() => {
    if (!data) return []
    return data.map((item) => ({
      date: item.date,
      profit: item.profit,
    }))
  }, [data])

  // Only update chart data when necessary, not on every render
  useEffect(() => {
    // Only update chart data when necessary, not on every render
    if (data && data.length > 0) {
      setChartData(memoizedChartData)
    }
  }, [data, memoizedChartData]) // Only depend on data, not on derived state

  // Add checks to prevent unnecessary updates:
  const updateChartData = useCallback(
    (newData) => {
      if (JSON.stringify(chartData) !== JSON.stringify(newData)) {
        setChartData(newData)
      }
    },
    [chartData],
  )

  return (
    <div>
      <h2>Overview</h2>
      {/* Display chart using chartData */}
      {chartData.length > 0 ? (
        <ul>
          {chartData.map((item, index) => (
            <li key={index}>
              Date: {item.date}, Profit: {item.profit}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  )
}

export default Overview
