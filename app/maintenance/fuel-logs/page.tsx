"use client"

import { useEffect, useState } from 'react'

type Fuel = { id: string; assetId: string; date: string; liters: number }

export default function FuelLogsPage() {
	const [items, setItems] = useState<Fuel[]>([])
	const [assetId, setAssetId] = useState('')
	const [date, setDate] = useState('')
	const [liters, setLiters] = useState(0)

	async function load() {
		const res = await fetch('/api/maintenance/fuel-logs')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/maintenance/fuel-logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assetId, date: date || undefined, liters: Number(liters) }) })
		setAssetId(''); setDate(''); setLiters(0)
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Fuel Logs</h1>
			<div className="flex flex-wrap gap-2">
				<input value={assetId} onChange={(e)=>setAssetId(e.target.value)} placeholder="Asset ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="number" value={liters} onChange={(e)=>setLiters(Number(e.target.value))} placeholder="Liters" className="input-shadow rounded px-2 py-1 w-28 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Date</th><th className="p-2">Asset</th><th className="p-2">Liters</th></tr></thead>
				<tbody>
					{items.map(f => (
						<tr key={f.id} className="row-shadow"><td className="p-2">{new Date(f.date).toLocaleDateString()}</td><td className="p-2">{f.assetId}</td><td className="p-2">{f.liters}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

