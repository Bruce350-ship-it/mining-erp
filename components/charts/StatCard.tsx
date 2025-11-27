interface StatCardProps {
    label: string
    value: string | number
    icon: React.ReactNode
    trend?: { value: number; isPositive: boolean }
    color?: string
}

export default function StatCard({ label, value, icon, trend, color = 'blue' }: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600',
        gray: 'bg-gray-50 text-gray-600',
    }

    return (
        <div className="card-shadow rounded-lg p-6 bg-white">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-gray-500 ml-2">vs last period</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}
