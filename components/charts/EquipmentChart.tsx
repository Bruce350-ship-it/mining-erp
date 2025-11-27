'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import ChartCard from './ChartCard'

interface EquipmentChartProps {
    data: { status: string; _count: { status: number } }[]
}

const COLORS = {
    available: '#10B981',
    'in-use': '#3B82F6',
    maintenance: '#F59E0B',
    inactive: '#6B7280',
}

export function EquipmentChart({ data }: EquipmentChartProps) {
    const chartData = data.map(item => ({
        name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        value: item._count.status,
        status: item.status,
    }))

    return (
        <ChartCard title="Equipment Status">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS] || '#6B7280'} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}
