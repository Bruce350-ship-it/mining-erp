"use client"

import { useEffect, useState } from 'react'

type Blast = { id: string; pitId: string; explosivesKg: number; notes?: string | null; date: string }

export default function BlastRecordsPage() {
	const [items, setItems] = useState<Blast[]>([])
	const [pitId, setPitId] = useState('')
	const [explosivesKg, setKg] = useState(0)
	const [notes, setNotes] = useState('')

	async function load() {
		const res = await fetch('/api/operations/blast-records')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/operations/blast-records', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pitId, explosivesKg: Number(explosivesKg), notes: notes || undefined }) })
		setPitId(''); setKg(0); setNotes('');
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Blast Records</h1>
			<div className="flex flex-wrap gap-2">
				<input value={pitId} onChange={(e)=>setPitId(e.target.value)} placeholder="Pit ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="number" value={explosivesKg} onChange={(e)=>setKg(Number(e.target.value))} placeholder="Explosives (kg)" className="input-shadow rounded px-2 py-1 w-36 bg-white" />
				<input value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Notes" className="input-shadow rounded px-2 py-1 w-64 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Date</th><th className="p-2">Pit</th><th className="p-2">Explosives (kg)</th><th className="p-2">Notes</th></tr></thead>
				<tbody>
					{items.map(b => (
						<tr key={b.id} className="row-shadow"><td className="p-2">{new Date(b.date).toLocaleString()}</td><td className="p-2">{b.pitId}</td><td className="p-2">{b.explosivesKg}</td><td className="p-2">{b.notes}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

