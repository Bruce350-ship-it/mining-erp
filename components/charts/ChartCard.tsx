interface ChartCardProps {
    title: string
    children: React.ReactNode
    className?: string
}

export default function ChartCard({ title, children, className = '' }: ChartCardProps) {
    return (
        <div className={`card-shadow rounded-lg p-6 bg-white ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="w-full">
                {children}
            </div>
        </div>
    )
}
