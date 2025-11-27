"use client"

import Link from "next/link"
import { useState } from "react"
import { userHasPermission } from "@/lib/rbac-ui"

interface SidebarProps {
	isOpen: boolean
	onClose?: () => void
}

interface ModuleSectionProps {
	title: string
	icon: React.ReactNode
	children: React.ReactNode
	isExpanded: boolean
	onToggle: () => void
}

function ModuleSection({ title, icon, children, isExpanded, onToggle }: ModuleSectionProps) {
	return (
		<div>
			<button
				onClick={onToggle}
				className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100 transition-colors"
			>
				<div className="w-5 h-5 flex-shrink-0 text-gray-700">
					{icon}
				</div>
				<span className="flex-1 text-left font-medium text-gray-900">{title}</span>
				<svg
					className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
				</svg>
			</button>
			{isExpanded && (
				<ul className="mt-1 ml-8 space-y-1">
					{children}
				</ul>
			)}
		</div>
	)

}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
	const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

	const toggleModule = (moduleName: string) => {
		setExpandedModules(prev => {
			const next = new Set(prev)
			if (next.has(moduleName)) {
				next.delete(moduleName)
			} else {
				next.add(moduleName)
			}
			return next
		})
	}

	return (
		<>
			{/* Overlay for mobile */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
					onClick={onClose}
				/>
			)}
			{/* Sidebar width: Change w-64 to w-48 (192px), w-56 (224px), w-64 (256px), w-72 (288px), w-80 (320px) */}
			<aside className={`fixed sm:relative top-16 sm:top-0 left-0 bottom-0 z-40 w-48 shrink-0 shadow-lg p-4 space-y-2 bg-white transition-transform duration-300 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
				}`}>
				<nav className="space-y-2 text-sm">
					{/* Core - Direct Links */}
					<div className="mb-2">
						<Link href="/" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100">
							<svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
							</svg>
							<span className="font-medium text-gray-900">Dashboard</span>
						</Link>
					</div>
					<div className="mb-2">
						<Link href="/analytics" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100">
							<svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
							<span className="font-medium text-gray-900">Analytics</span>
						</Link>
					</div>

					{/* Operations */}
					<ModuleSection
						title="Operations"
						icon={
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
							</svg>
						}
						isExpanded={expandedModules.has('operations')}
						onToggle={() => toggleModule('operations')}
					>
						{userHasPermission('operations.view') && <li><Link href="/operations/material-movements" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Material Movements</Link></li>}
						{userHasPermission('operations.view') && <li><Link href="/operations/mines" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Mines</Link></li>}
						{userHasPermission('operations.view') && <li><Link href="/operations/pits" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Pits</Link></li>}
						{userHasPermission('operations.view') && <li><Link href="/operations/logs" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Operations Log</Link></li>}
						{userHasPermission('operations.view') && <li><Link href="/operations/drill-logs" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Drill Logs</Link></li>}
						{userHasPermission('operations.view') && <li><Link href="/operations/blast-records" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Blast Records</Link></li>}
						{userHasPermission('operations.view') && <li><Link href="/operations/ore-grades" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Ore Grades</Link></li>}
						{userHasPermission('operations.view') && <li><Link href="/operations/equipment" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Equipment</Link></li>}
					</ModuleSection>

					{/* Maintenance */}
					<ModuleSection
						title="Maintenance"
						icon={
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						}
						isExpanded={expandedModules.has('maintenance')}
						onToggle={() => toggleModule('maintenance')}
					>
						{userHasPermission('maintenance.view') && <li><Link href="/maintenance/breakdowns" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Breakdowns</Link></li>}
						{userHasPermission('maintenance.view') && <li><Link href="/maintenance/assets" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Assets</Link></li>}
						{userHasPermission('maintenance.view') && <li><Link href="/maintenance/schedules" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Schedules</Link></li>}
						{userHasPermission('maintenance.view') && <li><Link href="/maintenance/work-orders" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Work Orders</Link></li>}
						{userHasPermission('maintenance.view') && <li><Link href="/maintenance/fuel-logs" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Fuel Logs</Link></li>}
					</ModuleSection>

					{/* Inventory */}
					<ModuleSection
						title="Inventory"
						icon={
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
							</svg>
						}
						isExpanded={expandedModules.has('inventory')}
						onToggle={() => toggleModule('inventory')}
					>
						{userHasPermission('inventory.view') && <li><Link href="/inventory/receipts" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Receipts</Link></li>}
						{userHasPermission('inventory.view') && <li><Link href="/inventory/suppliers" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Suppliers</Link></li>}
						{userHasPermission('inventory.view') && <li><Link href="/inventory/warehouses" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Warehouses</Link></li>}
						{userHasPermission('inventory.view') && <li><Link href="/inventory/items" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Items</Link></li>}
						{userHasPermission('inventory.view') && <li><Link href="/inventory/stock-levels" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Stock Levels</Link></li>}
						{userHasPermission('procurement.view') && <li><Link href="/procurement/rfqs" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">RFQs</Link></li>}
						{userHasPermission('procurement.view') && <li><Link href="/procurement/tenders" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Tenders</Link></li>}
						{userHasPermission('procurement.view') && <li><Link href="/procurement/contracts" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Contracts</Link></li>}
						{userHasPermission('procurement.view') && <li><Link href="/procurement/purchase-orders" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Purchase Orders</Link></li>}
					</ModuleSection>

					{/* HR / Payroll */}
					<ModuleSection
						title="HR / Payroll"
						icon={
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
						}
						isExpanded={expandedModules.has('hr')}
						onToggle={() => toggleModule('hr')}
					>
						{userHasPermission('hr.view') && <li><Link href="/hr/employees" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Employees</Link></li>}
						{userHasPermission('hr.view') && <li><Link href="/hr/certifications" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Certifications</Link></li>}
						{userHasPermission('hr.view') && <li><Link href="/hr/attendance" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Attendance</Link></li>}
						{userHasPermission('hr.view') && <li><Link href="/hr/incidents" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Incidents</Link></li>}
						{userHasPermission('hr.view') && <li><Link href="/payroll/runs" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Payroll Runs</Link></li>}
					</ModuleSection>

					{/* Finance */}
					<ModuleSection
						title="Finance"
						icon={
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						}
						isExpanded={expandedModules.has('finance')}
						onToggle={() => toggleModule('finance')}
					>
						{userHasPermission('finance.view') && <li><Link href="/finance/accounts" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">GL Accounts</Link></li>}
						{userHasPermission('finance.view') && <li><Link href="/finance/journal" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Journal</Link></li>}
						{userHasPermission('finance.view') && <li><Link href="/finance/invoices" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Invoices</Link></li>}
						{userHasPermission('finance.view') && <li><Link href="/finance/expenses" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Expenses</Link></li>}
						{userHasPermission('finance.view') && <li><Link href="/finance/cost-centers" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Cost Centers</Link></li>}
						{userHasPermission('finance.view') && <li><Link href="/finance/royalties" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Royalties</Link></li>}
						{userHasPermission('finance.view') && <li><Link href="/finance/tax-reports" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Tax Reports</Link></li>}
					</ModuleSection>

					{/* Safety & Env */}
					<ModuleSection
						title="Safety & Env"
						icon={
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						}
						isExpanded={expandedModules.has('safety')}
						onToggle={() => toggleModule('safety')}
					>
						{userHasPermission('environment.view') && <li><Link href="/safety/incidents" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Incidents</Link></li>}
						{userHasPermission('environment.view') && <li><Link href="/environment/inspections" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Inspections</Link></li>}
						{userHasPermission('environment.view') && <li><Link href="/environment/ppe" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">PPE Issued</Link></li>}
						{userHasPermission('environment.view') && <li><Link href="/environment/readings" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Readings</Link></li>}
						{userHasPermission('environment.view') && <li><Link href="/environment/emissions" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Emissions</Link></li>}
						{userHasPermission('environment.view') && <li><Link href="/environment/waste-logs" className="block px-2 py-1.5 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900">Waste Logs</Link></li>}
					</ModuleSection>
				</nav>
			</aside>
		</>
	)
}
