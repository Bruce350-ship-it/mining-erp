'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartCard from './ChartCard'

interface StockLevelsChartProps {
    data: {
        quantity: number
        inventoryItem: { name: string }
    }[]
}

export function StockLevelsChart({ data }: StockLevelsChartProps) {
    const chartData = data.map(item => ({
        name: item.inventoryItem.name.length > 20
            ? item.inventoryItem.name.substring(0, 17) + '...'
            : item.inventoryItem.name,
        quantity: item.quantity,
    }))

    return (
        <ChartCard title="Top 10 Stock Levels">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#10B981" />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}
