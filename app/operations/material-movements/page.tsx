"use client"

import { useEffect, useState } from 'react'

type Movement = {
	id: string
	date: string
	sourcePitId?: string | null
	destination: string
	materialType: string
	tons: number
	approved: boolean
}

export default function MaterialMovementsPage() {
	const [items, setItems] = useState<Movement[]>([])
	const [destination, setDestination] = useState('')
	const [materialType, setMaterialType] = useState('Ore')
	const [tons, setTons] = useState(0)

	async function load() {
		const res = await fetch('/api/operations/material-movements')
		setItems(await res.json())
	}

	useEffect(() => {
		load()
	}, [])

	async function create() {
		await fetch('/api/operations/material-movements', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ destination, materialType, tons: Number(tons) }),
		})
		setDestination('')
		setMaterialType('Ore')
		setTons(0)
		await load()
	}

	async function approve(id: string, approved: boolean) {
		await fetch('/api/operations/material-movements', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, approved }),
		})
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Material Movements</h1>
			<div className="flex gap-2">
				<input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={materialType} onChange={(e) => setMaterialType(e.target.value)} placeholder="Material" className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="number" value={tons} onChange={(e) => setTons(Number(e.target.value))} placeholder="Tons" className="input-shadow rounded px-2 py-1 w-28 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead>
					<tr className="bg-gray-50">
						<th className="p-2">Date</th>
						<th className="p-2">Destination</th>
						<th className="p-2">Material</th>
						<th className="p-2">Tons</th>
						<th className="p-2">Approved</th>
						<th className="p-2">Actions</th>
					</tr>
				</thead>
				<tbody>
					{items.map((m) => (
						<tr key={m.id} className="row-shadow">
							<td className="p-2">{new Date(m.date).toLocaleString()}</td>
							<td className="p-2">{m.destination}</td>
							<td className="p-2">{m.materialType}</td>
							<td className="p-2">{m.tons}</td>
							<td className="p-2">{m.approved ? 'Yes' : 'No'}</td>
							<td className="p-2 space-x-2">
								<button onClick={() => approve(m.id, true)} className="rounded bg-green-600 text-white px-2 py-1">Approve</button>
								<button onClick={() => approve(m.id, false)} className="rounded bg-yellow-600 text-white px-2 py-1">Revoke</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

