"use client"

import { useEffect, useState } from 'react'

type Mine = { id: string; name: string; siteId?: string | null; createdAt: string }

export default function MinesPage() {
	const [items, setItems] = useState<Mine[]>([])
	const [name, setName] = useState('')
	const [siteId, setSiteId] = useState('')
	const [editing, setEditing] = useState<Record<string, { name?: string; siteId?: string }>>({})

	async function load() {
		const res = await fetch('/api/operations/mines')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/operations/mines', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, siteId: siteId || undefined }) })
		setName(''); setSiteId('');
		await load()
	}

	async function save(m: Mine) {
		const e = editing[m.id] || {}
		await fetch('/api/operations/mines', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: m.id, name: e.name ?? m.name, siteId: e.siteId ?? m.siteId ?? undefined }) })
		await load()
	}

	async function del(id: string) {
		await fetch(`/api/operations/mines?id=${id}`, { method: 'DELETE' })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Mines</h1>
			<div className="flex gap-2">
				<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={siteId} onChange={(e)=>setSiteId(e.target.value)} placeholder="Site ID (optional)" className="input-shadow rounded px-2 py-1 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Name</th><th className="p-2">Site</th><th className="p-2">Created</th><th className="p-2">Actions</th></tr></thead>
				<tbody>
					{items.map(m => (
						<tr key={m.id} className="row-shadow">
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={editing[m.id]?.name ?? m.name} onChange={(e)=>setEditing(prev=>({ ...prev, [m.id]: { ...(prev[m.id]||{}), name: e.target.value } }))} /></td>
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={editing[m.id]?.siteId ?? (m.siteId ?? '')} onChange={(e)=>setEditing(prev=>({ ...prev, [m.id]: { ...(prev[m.id]||{}), siteId: e.target.value } }))} /></td>
							<td className="p-2">{new Date(m.createdAt).toLocaleString()}</td>
							<td className="p-2 space-x-2"><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>save(m)}>Save</button><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>del(m.id)}>Delete</button></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

