"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import ChartCard from './ChartCard'

interface FuelConsumptionChartProps {
    data: { date: Date; liters: number | null }[]
}

export function FuelConsumptionChart({ data }: FuelConsumptionChartProps) {
    // Normalize data for the chart: convert date to a readable label and ensure numbers
    const chartData = data.map(d => ({
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        liters: d.liters || 0,
    }))

    return (
        <ChartCard title="Fuel Consumption (Last 30 Days)">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Liters', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="liters" stroke="#3B82F6" fillOpacity={1} fill="url(#colorLiters)" />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}
