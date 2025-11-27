'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ChartCard from './ChartCard'

interface MaterialMovementsChartProps {
    data: { date: Date; tons: number | null; materialType: string | null }[]
}

export function MaterialMovementsChart({ data }: MaterialMovementsChartProps) {
    // Group by date and sum tons
    const groupedData = data.reduce((acc, item) => {
        const dateStr = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const existing = acc.find(d => d.date === dateStr)
        if (existing) {
            existing.tons += item.tons || 0
        } else {
            acc.push({ date: dateStr, tons: item.tons || 0 })
        }
        return acc
    }, [] as { date: string; tons: number }[])

    return (
        <ChartCard title="Material Movements (Last 7 Days)">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={groupedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Tons', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="tons" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}
