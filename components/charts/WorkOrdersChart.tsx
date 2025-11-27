'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ChartCard from './ChartCard'

interface WorkOrdersChartProps {
    data: { status: string; _count: { status: number } }[]
}

const COLORS = {
    open: '#F59E0B',
    'in-progress': '#3B82F6',
    completed: '#10B981',
    closed: '#6B7280',
}

export function WorkOrdersChart({ data }: WorkOrdersChartProps) {
    const chartData = data.map(item => ({
        name: item.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        count: item._count.status,
        status: item.status,
    }))

    return (
        <ChartCard title="Work Orders by Status">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}
