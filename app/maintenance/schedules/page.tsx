"use client"

import { useEffect, useState } from 'react'

type Sched = { id: string; assetId: string; frequency: string; nextDueDate: string }

export default function SchedulesPage() {
	const [items, setItems] = useState<Sched[]>([])
	const [assetId, setAssetId] = useState('')
	const [frequency, setFrequency] = useState('monthly')
	const [nextDueDate, setNext] = useState('')
	const [editing, setEditing] = useState<Record<string, { frequency?: string; nextDueDate?: string }>>({})

	async function load() {
		const res = await fetch('/api/maintenance/schedules')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/maintenance/schedules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assetId, frequency, nextDueDate }) })
		setAssetId(''); setFrequency('monthly'); setNext('')
		await load()
	}

	async function save(s: Sched) {
		const e = editing[s.id] || {}
		await fetch('/api/maintenance/schedules', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id, frequency: e.frequency ?? s.frequency, nextDueDate: e.nextDueDate ?? s.nextDueDate }) })
		await load()
	}

	async function del(id: string) {
		await fetch(`/api/maintenance/schedules?id=${id}`, { method: 'DELETE' })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Maintenance Schedules</h1>
			<div className="flex flex-wrap gap-2">
				<input value={assetId} onChange={(e)=>setAssetId(e.target.value)} placeholder="Asset ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={frequency} onChange={(e)=>setFrequency(e.target.value)} placeholder="Frequency" className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="date" value={nextDueDate} onChange={(e)=>setNext(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Asset</th><th className="p-2">Frequency</th><th className="p-2">Next Due</th><th className="p-2">Actions</th></tr></thead>
				<tbody>
					{items.map(s => (
						<tr key={s.id} className="row-shadow">
							<td className="p-2">{s.assetId}</td>
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={editing[s.id]?.frequency ?? s.frequency} onChange={(e)=>setEditing(p=>({ ...p, [s.id]: { ...(p[s.id]||{}), frequency: e.target.value } }))} /></td>
							<td className="p-2"><input type="date" className="input-shadow rounded px-2 py-1 bg-white" value={editing[s.id]?.nextDueDate ?? s.nextDueDate.slice(0,10)} onChange={(e)=>setEditing(p=>({ ...p, [s.id]: { ...(p[s.id]||{}), nextDueDate: e.target.value } }))} /></td>
							<td className="p-2 space-x-2"><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>save(s)}>Save</button><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>del(s.id)}>Delete</button></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

