"use client"

import { useEffect, useState } from 'react'

type Item = { id: string; sku: string; name: string; uom: string }

export default function ItemsPage() {
	const [items, setItems] = useState<Item[]>([])
	const [sku, setSku] = useState('')
	const [name, setName] = useState('')
	const [uom, setUom] = useState('')
	const [editing, setEditing] = useState<Record<string, Partial<Item>>>({})

	async function load() {
		const res = await fetch('/api/inventory/items')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/inventory/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sku, name, uom }) })
		setSku(''); setName(''); setUom('')
		await load()
	}

	async function save(i: Item) {
		const e = editing[i.id] || {}
		await fetch('/api/inventory/items', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: i.id, sku: e.sku ?? i.sku, name: e.name ?? i.name, uom: e.uom ?? i.uom }) })
		await load()
	}

	async function del(id: string) {
		await fetch(`/api/inventory/items?id=${id}`, { method: 'DELETE' })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Inventory Items</h1>
			<div className="flex flex-wrap gap-2">
				<input value={sku} onChange={(e)=>setSku(e.target.value)} placeholder="SKU" className="input-shadow rounded px-2 py-1 w-32 bg-white" />
				<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={uom} onChange={(e)=>setUom(e.target.value)} placeholder="UoM" className="input-shadow rounded px-2 py-1 w-24 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">SKU</th><th className="p-2">Name</th><th className="p-2">UoM</th><th className="p-2">Actions</th></tr></thead>
				<tbody>
					{items.map(i => (
						<tr key={i.id} className="row-shadow">
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 w-32 bg-white" value={(editing[i.id]?.sku as string) ?? i.sku} onChange={(e)=>setEditing(p=>({ ...p, [i.id]: { ...(p[i.id]||{}), sku: e.target.value } }))} /></td>
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={(editing[i.id]?.name as string) ?? i.name} onChange={(e)=>setEditing(p=>({ ...p, [i.id]: { ...(p[i.id]||{}), name: e.target.value } }))} /></td>
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 w-24 bg-white" value={(editing[i.id]?.uom as string) ?? i.uom} onChange={(e)=>setEditing(p=>({ ...p, [i.id]: { ...(p[i.id]||{}), uom: e.target.value } }))} /></td>
							<td className="p-2 space-x-2"><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>save(i)}>Save</button><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>del(i.id)}>Delete</button></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

