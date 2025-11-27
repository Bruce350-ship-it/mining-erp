"use client"

import { useEffect, useState } from 'react'

type Warehouse = { id: string; name: string; location?: string | null }

export default function WarehousesPage() {
	const [items, setItems] = useState<Warehouse[]>([])
	const [name, setName] = useState('')
	const [location, setLocation] = useState('')
	const [editing, setEditing] = useState<Record<string, Partial<Warehouse>>>({})

	async function load() {
		const res = await fetch('/api/inventory/warehouses')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/inventory/warehouses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, location: location || undefined }) })
		setName(''); setLocation('')
		await load()
	}

	async function save(w: Warehouse) {
		const e = editing[w.id] || {}
		await fetch('/api/inventory/warehouses', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: w.id, name: e.name ?? w.name, location: e.location ?? w.location ?? undefined }) })
		await load()
	}

	async function del(id: string) {
		await fetch(`/api/inventory/warehouses?id=${id}`, { method: 'DELETE' })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Warehouses</h1>
			<div className="flex flex-wrap gap-2">
				<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="Location" className="input-shadow rounded px-2 py-1 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Name</th><th className="p-2">Location</th><th className="p-2">Actions</th></tr></thead>
				<tbody>
					{items.map(w => (
						<tr key={w.id} className="row-shadow">
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={(editing[w.id]?.name as string) ?? w.name} onChange={(e)=>setEditing(p=>({ ...p, [w.id]: { ...(p[w.id]||{}), name: e.target.value } }))} /></td>
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={(editing[w.id]?.location as string) ?? (w.location ?? '')} onChange={(e)=>setEditing(p=>({ ...p, [w.id]: { ...(p[w.id]||{}), location: e.target.value } }))} /></td>
							<td className="p-2 space-x-2"><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>save(w)}>Save</button><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>del(w.id)}>Delete</button></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

