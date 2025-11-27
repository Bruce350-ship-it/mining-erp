"use client"

import { useEffect, useState } from 'react'

type Drill = { id: string; pitId: string; meters: number; notes?: string | null; date: string }

export default function DrillLogsPage() {
	const [items, setItems] = useState<Drill[]>([])
	const [pitId, setPitId] = useState('')
	const [meters, setMeters] = useState(0)
	const [notes, setNotes] = useState('')

	async function load() {
		const res = await fetch('/api/operations/drill-logs')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/operations/drill-logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pitId, meters: Number(meters), notes: notes || undefined }) })
		setPitId(''); setMeters(0); setNotes('');
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Drill Logs</h1>
			<div className="flex flex-wrap gap-2">
				<input value={pitId} onChange={(e)=>setPitId(e.target.value)} placeholder="Pit ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="number" value={meters} onChange={(e)=>setMeters(Number(e.target.value))} placeholder="Meters" className="input-shadow rounded px-2 py-1 w-28 bg-white" />
				<input value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Notes" className="input-shadow rounded px-2 py-1 w-64 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Date</th><th className="p-2">Pit</th><th className="p-2">Meters</th><th className="p-2">Notes</th></tr></thead>
				<tbody>
					{items.map(d => (
						<tr key={d.id} className="row-shadow"><td className="p-2">{new Date(d.date).toLocaleString()}</td><td className="p-2">{d.pitId}</td><td className="p-2">{d.meters}</td><td className="p-2">{d.notes}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

