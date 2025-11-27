import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import StatCard from '@/components/charts/StatCard'
import ChartCard from '@/components/charts/ChartCard'
import { EquipmentChart } from '@/components/charts/EquipmentChart'
import { MaterialMovementsChart } from '@/components/charts/MaterialMovementsChart'
import { WorkOrdersChart } from '@/components/charts/WorkOrdersChart'

export default async function Home() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <a
                    className="rounded bg-black text-white px-4 py-2"
                    href="/auth/sign-in"
                >
                    Sign in to continue
                </a>
            </div>
        )
    }

    // Fetch dashboard data
    const [
        equipmentStats,
        workOrdersStats,
        movementsToday,
        receiptsToday,
        incidentsTotal,
        activeEmployees,
        recentMovements,
        recentIncidents
    ] = await Promise.all([
        // Equipment status breakdown
        prisma.equipment.groupBy({
            by: ['status'],
            _count: { status: true },
        }),
        // Work orders by status
        prisma.workOrder.groupBy({
            by: ['status'],
            _count: { status: true },
        }),
        // Today's movements
        prisma.materialMovement.count({
            where: { date: { gte: new Date(new Date().toDateString()) } },
        }),
        // Today's receipts
        prisma.receipt.count({
            where: { receivedAt: { gte: new Date(new Date().toDateString()) } },
        }),
        // Total incidents
        prisma.safetyIncident.count(),
        // Active employees (with attendance today) - count distinct employeeIds
        prisma.attendanceLog.groupBy({
            by: ['employeeId'],
            where: {
                checkIn: { gte: new Date(new Date().toDateString()) },
            },
        }).then(groups => groups.length),
        // Material movements last 7 days
        prisma.materialMovement.findMany({
            where: {
                date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            },
            select: { date: true, tons: true, materialType: true },
            orderBy: { date: 'asc' },
        }),
        // Recent incidents
        prisma.safetyIncident.findMany({
            take: 5,
            orderBy: { reportedAt: 'desc' },
            select: { id: true, severity: true, description: true, reportedAt: true },
        }),
    ])

    // Calculate totals
    const totalEquipment = equipmentStats.reduce((sum, stat) => sum + stat._count.status, 0)
    const openWorkOrders = workOrdersStats.find(s => s.status === 'open')?._count.status || 0

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Equipment"
                    value={totalEquipment}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    }
                    color="blue"
                />
                <StatCard
                    label="Open Work Orders"
                    value={openWorkOrders}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    }
                    color="yellow"
                />
                <StatCard
                    label="Material Movements Today"
                    value={movementsToday}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    }
                    color="green"
                />
                <StatCard
                    label="Active Employees Today"
                    value={activeEmployees}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    }
                    color="blue"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EquipmentChart data={equipmentStats} />
                <WorkOrdersChart data={workOrdersStats} />
            </div>

            {/* Material Movements Chart */}
            <MaterialMovementsChart data={recentMovements} />

            {/* Recent Activity */}
            <ChartCard title="Recent Safety Incidents">
                <div className="space-y-3">
                    {recentIncidents.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No recent incidents</p>
                    ) : (
                        recentIncidents.map((incident) => (
                            <div key={incident.id} className="flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{incident.description}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(incident.reportedAt).toLocaleString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${incident.severity === 'critical'
                                            ? 'bg-red-100 text-red-700'
                                            : incident.severity === 'major'
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                >
                                    {incident.severity}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </ChartCard>
        </div>
    )
}
