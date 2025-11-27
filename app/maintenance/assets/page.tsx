"use client"

import { useEffect, useState } from 'react'

type Asset = { id: string; code: string; name: string; category: string; status: string; createdAt: string }

export default function AssetsPage() {
	const [items, setItems] = useState<Asset[]>([])
	const [code, setCode] = useState('')
	const [name, setName] = useState('')
	const [category, setCategory] = useState('')
	const [status, setStatus] = useState('active')
	const [editing, setEditing] = useState<Record<string, Partial<Asset>>>({})

	async function load() {
		const res = await fetch('/api/maintenance/assets')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/maintenance/assets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, name, category, status }) })
		setCode(''); setName(''); setCategory(''); setStatus('active')
		await load()
	}

	async function save(a: Asset) {
		const e = editing[a.id] || {}
		await fetch('/api/maintenance/assets', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: a.id, code: e.code ?? a.code, name: e.name ?? a.name, category: e.category ?? a.category, status: e.status ?? a.status }) })
		await load()
	}

	async function del(id: string) {
		await fetch(`/api/maintenance/assets?id=${id}`, { method: 'DELETE' })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Assets</h1>
			<div className="flex flex-wrap gap-2">
				<input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Code" className="input-shadow rounded px-2 py-1 w-28 bg-white" />
				<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category" className="input-shadow rounded px-2 py-1 bg-white" />
				<select value={status} onChange={(e)=>setStatus(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white">
					<option value="active">active</option>
					<option value="inactive">inactive</option>
					<option value="retired">retired</option>
				</select>
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Code</th><th className="p-2">Name</th><th className="p-2">Category</th><th className="p-2">Status</th><th className="p-2">Created</th><th className="p-2">Actions</th></tr></thead>
				<tbody>
					{items.map(a => (
						<tr key={a.id} className="row-shadow">
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 w-28 bg-white" value={(editing[a.id]?.code as string) ?? a.code} onChange={(e)=>setEditing(p=>({ ...p, [a.id]: { ...(p[a.id]||{}), code: e.target.value } }))} /></td>
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={(editing[a.id]?.name as string) ?? a.name} onChange={(e)=>setEditing(p=>({ ...p, [a.id]: { ...(p[a.id]||{}), name: e.target.value } }))} /></td>
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={(editing[a.id]?.category as string) ?? a.category} onChange={(e)=>setEditing(p=>({ ...p, [a.id]: { ...(p[a.id]||{}), category: e.target.value } }))} /></td>
							<td className="p-2">
								<select className="input-shadow rounded px-2 py-1 bg-white" value={(editing[a.id]?.status as string) ?? a.status} onChange={(e)=>setEditing(p=>({ ...p, [a.id]: { ...(p[a.id]||{}), status: e.target.value } }))}>
									<option value="active">active</option>
									<option value="inactive">inactive</option>
									<option value="retired">retired</option>
								</select>
							</td>
							<td className="p-2">{new Date(a.createdAt).toLocaleString()}</td>
							<td className="p-2 space-x-2"><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>save(a)}>Save</button><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>del(a.id)}>Delete</button></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

