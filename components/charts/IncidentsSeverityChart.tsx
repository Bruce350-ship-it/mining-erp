'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import ChartCard from './ChartCard'

interface IncidentsSeverityChartProps {
    data: { severity: string; _count: { severity: number } }[]
}

const COLORS = {
    minor: '#10B981',
    major: '#F59E0B',
    critical: '#EF4444',
}

export function IncidentsSeverityChart({ data }: IncidentsSeverityChartProps) {
    const chartData = data.map(item => ({
        name: item.severity.charAt(0).toUpperCase() + item.severity.slice(1),
        value: item._count.severity,
        severity: item.severity,
    }))

    return (
        <ChartCard title="Incidents by Severity">
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
                            <Cell key={`cell-${index}`} fill={COLORS[entry.severity as keyof typeof COLORS] || '#6B7280'} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}
