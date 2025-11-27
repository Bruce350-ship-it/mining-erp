"use client"

import { useEffect, useState } from 'react'

type Breakdown = {
	id: string
	equipmentId: string
	reportedAt: string
	severity: string
	description?: string | null
}

export default function BreakdownsPage() {
	const [items, setItems] = useState<Breakdown[]>([])
	const [equipmentId, setEquipmentId] = useState('')
	const [severity, setSeverity] = useState('medium')
	const [description, setDescription] = useState('')

	async function load() {
		const res = await fetch('/api/maintenance/breakdowns')
		setItems(await res.json())
	}

	useEffect(() => {
		load()
	}, [])

	async function create() {
		await fetch('/api/maintenance/breakdowns', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ equipmentId, severity, description }),
		})
		setEquipmentId('')
		setSeverity('medium')
		setDescription('')
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Breakdown Reports</h1>
			<div className="flex flex-wrap gap-2">
				<input value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} placeholder="Equipment ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<select value={severity} onChange={(e) => setSeverity(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white">
					<option value="low">low</option>
					<option value="medium">medium</option>
					<option value="high">high</option>
				</select>
				<input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="input-shadow rounded px-2 py-1 w-64 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Log</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead>
					<tr className="bg-gray-50">
						<th className="p-2">Reported At</th>
						<th className="p-2">Equipment</th>
						<th className="p-2">Severity</th>
						<th className="p-2">Description</th>
					</tr>
				</thead>
				<tbody>
					{items.map((b) => (
						<tr key={b.id} className="row-shadow">
							<td className="p-2">{new Date(b.reportedAt).toLocaleString()}</td>
							<td className="p-2">{b.equipmentId}</td>
							<td className="p-2">{b.severity}</td>
							<td className="p-2">{b.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

