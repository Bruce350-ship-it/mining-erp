"use client"

import { useEffect, useState } from 'react'

type CC = { id: string; code: string; name: string }

export default function CostCentersPage() {
	const [items, setItems] = useState<CC[]>([])
	const [code, setCode] = useState('')
	const [name, setName] = useState('')
	const [editing, setEditing] = useState<Record<string, Partial<CC>>>({})

	async function load() {
		const res = await fetch('/api/finance/cost-centers')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/finance/cost-centers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, name }) })
		setCode(''); setName('')
		await load()
	}

	async function save(c: CC) {
		const e = editing[c.id] || {}
		await fetch('/api/finance/cost-centers', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id, code: e.code ?? c.code, name: e.name ?? c.name }) })
		await load()
	}

	async function del(id: string) {
		await fetch(`/api/finance/cost-centers?id=${id}`, { method: 'DELETE' })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Cost Centers</h1>
			<div className="flex gap-2">
				<input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Code" className="input-shadow rounded px-2 py-1 w-28 bg-white" />
				<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="input-shadow rounded px-2 py-1 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Create</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Code</th><th className="p-2">Name</th><th className="p-2">Actions</th></tr></thead><tbody>
				{items.map(c => (
					<tr key={c.id} className="row-shadow">
						<td className="p-2"><input className="input-shadow rounded px-2 py-1 w-28 bg-white" value={(editing[c.id]?.code as string) ?? c.code} onChange={(e)=>setEditing(p=>({ ...p, [c.id]: { ...(p[c.id]||{}), code: e.target.value } }))} /></td>
						<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={(editing[c.id]?.name as string) ?? c.name} onChange={(e)=>setEditing(p=>({ ...p, [c.id]: { ...(p[c.id]||{}), name: e.target.value } }))} /></td>
						<td className="p-2 space-x-2"><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>save(c)}>Save</button><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>del(c.id)}>Delete</button></td>
					</tr>
				))}
			</tbody></table>
		</div>
	)
}

