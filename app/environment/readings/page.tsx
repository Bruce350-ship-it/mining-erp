"use client"

import { useEffect, useState } from 'react'

type Reading = { id: string; siteId?: string | null; type: string; value: number; unit: string; takenAt: string }

export default function EnvReadingsPage() {
	const [items, setItems] = useState<Reading[]>([])
	const [siteId, setSiteId] = useState('')
	const [type, setType] = useState('air')
	const [value, setValue] = useState(0)
	const [unit, setUnit] = useState('ppm')

	async function load() {
		const res = await fetch('/api/environment/readings')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/environment/readings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ siteId: siteId || undefined, type, value: Number(value), unit }) })
		setSiteId(''); setType('air'); setValue(0); setUnit('ppm')
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Environmental Readings</h1>
			<div className="flex flex-wrap gap-2">
				<input value={siteId} onChange={(e)=>setSiteId(e.target.value)} placeholder="Site ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={type} onChange={(e)=>setType(e.target.value)} placeholder="Type" className="input-shadow rounded px-2 py-1 w-32 bg-white" />
				<input type="number" value={value} onChange={(e)=>setValue(Number(e.target.value))} placeholder="Value" className="input-shadow rounded px-2 py-1 w-28 bg-white" />
				<input value={unit} onChange={(e)=>setUnit(e.target.value)} placeholder="Unit" className="input-shadow rounded px-2 py-1 w-24 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Record</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Taken</th><th className="p-2">Site</th><th className="p-2">Type</th><th className="p-2">Value</th><th className="p-2">Unit</th></tr></thead>
				<tbody>
					{items.map(r => (
						<tr key={r.id} className="row-shadow"><td className="p-2">{new Date(r.takenAt).toLocaleString()}</td><td className="p-2">{r.siteId ?? '-'}</td><td className="p-2">{r.type}</td><td className="p-2">{r.value}</td><td className="p-2">{r.unit}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

