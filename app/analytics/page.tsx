import { prisma } from '@/lib/db'
import StatCard from '@/components/charts/StatCard'
import ChartCard from '@/components/charts/ChartCard'
import { OreGradesChart } from '@/components/charts/OreGradesChart'
import { FuelConsumptionChart } from '@/components/charts/FuelConsumptionChart'
import { StockLevelsChart } from '@/components/charts/StockLevelsChart'
import { IncidentsSeverityChart } from '@/components/charts/IncidentsSeverityChart'

export default async function AnalyticsPage() {
	// Fetch analytics data
	const [
		totalAssets,
		totalEmployees,
		totalSuppliers,
		incidentsCount,
		oreGrades,
		fuelLogs,
		stockLevels,
		incidentsBySeverity,
		attendanceLast30,
		workOrdersCompletion,
	] = await Promise.all([
		// Assets count
		prisma.asset.count({ where: { status: 'active' } }),
		// Employees count
		prisma.employee.count({ where: { active: true } }),
		// Suppliers count
		prisma.supplier.count(),
		// Incidents count
		prisma.safetyIncident.count(),
		// Ore grades (last 30 entries)
		prisma.oreGrade.findMany({
			take: 30,
			orderBy: { date: 'desc' },
			include: { pit: { select: { name: true } } },
		}),
		// Fuel consumption last 30 days
		prisma.fuelLog.findMany({
			where: {
				date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
			},
			select: { date: true, liters: true },
			orderBy: { date: 'asc' },
		}),
		// Top 10 stock levels
		prisma.stockLevel.findMany({
			take: 10,
			orderBy: { quantity: 'desc' },
			include: {
				inventoryItem: { select: { name: true } },
			},
		}),
		// Incidents by severity
		prisma.safetyIncident.groupBy({
			by: ['severity'],
			_count: { severity: true },
		}),
		// Attendance last 30 days - count distinct employee check-ins
		prisma.attendanceLog.groupBy({
			by: ['employeeId', 'checkIn'],
			where: {
				checkIn: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
			},
		}).then(groups => groups.length),
		// Work orders completion stats
		prisma.workOrder.groupBy({
			by: ['status'],
			_count: { status: true },
		}),
	])

	const completedOrders = workOrdersCompletion.find(w => w.status === 'completed')?._count.status || 0
	const totalOrders = workOrdersCompletion.reduce((sum, w) => sum + w._count.status, 0)
	const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

			{/* Top KPIs */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					label="Active Assets"
					value={totalAssets}
					icon={
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
						</svg>
					}
					color="blue"
				/>
				<StatCard
					label="Active Employees"
					value={totalEmployees}
					icon={
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					}
					color="green"
				/>
				<StatCard
					label="Total Suppliers"
					value={totalSuppliers}
					icon={
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
						</svg>
					}
					color="blue"
				/>
				<StatCard
					label="Work Order Completion"
					value={`${completionRate}%`}
					icon={
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					}
					color="green"
				/>
			</div>

			{/* Operations Analytics */}
			<div>
				<h2 className="text-xl font-semibold text-gray-900 mb-4">Operations Analytics</h2>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<OreGradesChart data={oreGrades} />
					<ChartCard title="Attendance (Last 30 Days)">
						<div className="flex items-center justify-center h-48">
							<div className="text-center">
								<p className="text-5xl font-bold text-blue-600">{attendanceLast30}</p>
								<p className="text-gray-500 mt-2">Total Check-ins</p>
							</div>
						</div>
					</ChartCard>
				</div>
			</div>

			{/* Maintenance & Inventory */}
			<div>
				<h2 className="text-xl font-semibold text-gray-900 mb-4">Maintenance & Inventory</h2>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<FuelConsumptionChart data={fuelLogs} />
					<StockLevelsChart data={stockLevels} />
				</div>
			</div>

			{/* Safety & Environment */}
			<div>
				<h2 className="text-xl font-semibold text-gray-900 mb-4">Safety & Environment</h2>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<IncidentsSeverityChart data={incidentsBySeverity} />
					<ChartCard title="Safety Score">
						<div className="flex items-center justify-center h-48">
							<div className="text-center">
								<p className="text-5xl font-bold text-green-600">
									{incidentsCount === 0 ? '100' : Math.max(0, 100 - incidentsCount * 2)}
								</p>
								<p className="text-gray-500 mt-2">Safety Rating</p>
								<p className="text-sm text-gray-400 mt-1">{incidentsCount} incidents recorded</p>
							</div>
						</div>
					</ChartCard>
				</div>
			</div>
		</div>
	)
}
