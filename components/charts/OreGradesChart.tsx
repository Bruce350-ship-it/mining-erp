'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ChartCard from './ChartCard'

interface OreGradesChartProps {
    data: {
        id: string
        gradeAu: number | null
        gradeCu: number | null
        gradeFe: number | null
        pit: { name: string }
        date: Date
    }[]
}

export function OreGradesChart({ data }: OreGradesChartProps) {
    const chartData = data.reverse().map((item, index) => ({
        name: `Sample ${index + 1}`,
        Au: item.gradeAu || 0,
        Cu: item.gradeCu || 0,
        Fe: item.gradeFe || 0,
    }))

    return (
        <ChartCard title="Ore Grades Trend">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Grade (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Au" stroke="#FFD700" strokeWidth={2} name="Gold (Au)" />
                    <Line type="monotone" dataKey="Cu" stroke="#B87333" strokeWidth={2} name="Copper (Cu)" />
                    <Line type="monotone" dataKey="Fe" stroke="#FF6B6B" strokeWidth={2} name="Iron (Fe)" />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}
