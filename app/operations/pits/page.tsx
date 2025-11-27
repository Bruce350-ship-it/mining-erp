"use client"

import { useEffect, useState } from 'react'

type Pit = { id: string; name: string; mineId: string; createdAt: string }

export default function PitsPage() {
	const [items, setItems] = useState<Pit[]>([])
	const [name, setName] = useState('')
	const [mineId, setMineId] = useState('')
	const [editing, setEditing] = useState<Record<string, { name?: string; mineId?: string }>>({})

	async function load() {
		const res = await fetch('/api/operations/pits')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/operations/pits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, mineId }) })
		setName(''); setMineId('');
		await load()
	}

	async function save(p: Pit) {
		const e = editing[p.id] || {}
		await fetch('/api/operations/pits', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, name: e.name ?? p.name, mineId: e.mineId ?? p.mineId }) })
		await load()
	}

	async function del(id: string) {
		await fetch(`/api/operations/pits?id=${id}`, { method: 'DELETE' })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Pits</h1>
			<div className="flex gap-2">
				<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={mineId} onChange={(e)=>setMineId(e.target.value)} placeholder="Mine ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Name</th><th className="p-2">Mine</th><th className="p-2">Created</th><th className="p-2">Actions</th></tr></thead>
				<tbody>
					{items.map(p => (
						<tr key={p.id} className="row-shadow">
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={editing[p.id]?.name ?? p.name} onChange={(e)=>setEditing(prev=>({ ...prev, [p.id]: { ...(prev[p.id]||{}), name: e.target.value } }))} /></td>
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={editing[p.id]?.mineId ?? p.mineId} onChange={(e)=>setEditing(prev=>({ ...prev, [p.id]: { ...(prev[p.id]||{}), mineId: e.target.value } }))} /></td>
							<td className="p-2">{new Date(p.createdAt).toLocaleString()}</td>
							<td className="p-2 space-x-2"><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>save(p)}>Save</button><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>del(p.id)}>Delete</button></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

