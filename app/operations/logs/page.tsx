"use client"

import { useEffect, useState } from 'react'

type OpLog = { id: string; date: string; pitId?: string | null; equipmentId?: string | null; notes?: string | null }

export default function OperationsLogsPage() {
	const [items, setItems] = useState<OpLog[]>([])
	const [pitId, setPitId] = useState('')
	const [equipmentId, setEquipmentId] = useState('')
	const [notes, setNotes] = useState('')

	async function load() {
		const res = await fetch('/api/operations/logs')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/operations/logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pitId: pitId || undefined, equipmentId: equipmentId || undefined, notes: notes || undefined }) })
		setPitId(''); setEquipmentId(''); setNotes('');
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Operations Log</h1>
			<div className="flex flex-wrap gap-2">
				<input value={pitId} onChange={(e)=>setPitId(e.target.value)} placeholder="Pit ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={equipmentId} onChange={(e)=>setEquipmentId(e.target.value)} placeholder="Equipment ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Notes" className="input-shadow rounded px-2 py-1 w-64 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Date</th><th className="p-2">Pit</th><th className="p-2">Equipment</th><th className="p-2">Notes</th></tr></thead>
				<tbody>
					{items.map(o => (
						<tr key={o.id} className="row-shadow"><td className="p-2">{new Date(o.date).toLocaleString()}</td><td className="p-2">{o.pitId ?? '-'}</td><td className="p-2">{o.equipmentId ?? '-'}</td><td className="p-2">{o.notes ?? ''}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

