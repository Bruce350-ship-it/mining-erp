"use client"

import { useEffect, useState } from 'react'
import { useToast } from '@/components/Toast'

type Supplier = { id: string; name: string; email?: string | null; phone?: string | null }

export default function SuppliersPage() {
	const [items, setItems] = useState<Supplier[]>([])
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [editing, setEditing] = useState<Record<string, Partial<Supplier>>>({})
	const { notify } = useToast()

	async function load() {
		const res = await fetch('/api/inventory/suppliers')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/inventory/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email: email || undefined, phone: phone || undefined }) })
		setName(''); setEmail(''); setPhone('')
		await load()
		notify('Supplier created')
	}

	async function save(s: Supplier) {
		const e = editing[s.id] || {}
		await fetch('/api/inventory/suppliers', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id, name: e.name ?? s.name, email: e.email ?? s.email ?? undefined, phone: e.phone ?? s.phone ?? undefined }) })
		await load()
		notify('Supplier updated')
	}

	async function del(id: string) {
		await fetch(`/api/inventory/suppliers?id=${id}`, { method: 'DELETE' })
		await load()
		notify('Supplier deleted')
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Suppliers</h1>
			<div className="flex flex-wrap gap-2">
				<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone" className="input-shadow rounded px-2 py-1 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Phone</th><th className="p-2">Actions</th></tr></thead>
				<tbody>
					{items.map(s => (
						<tr key={s.id} className="row-shadow">
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={(editing[s.id]?.name as string) ?? s.name} onChange={(e)=>setEditing(p=>({ ...p, [s.id]: { ...(p[s.id]||{}), name: e.target.value } }))} /></td>
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={(editing[s.id]?.email as string) ?? (s.email ?? '')} onChange={(e)=>setEditing(p=>({ ...p, [s.id]: { ...(p[s.id]||{}), email: e.target.value } }))} /></td>
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={(editing[s.id]?.phone as string) ?? (s.phone ?? '')} onChange={(e)=>setEditing(p=>({ ...p, [s.id]: { ...(p[s.id]||{}), phone: e.target.value } }))} /></td>
							<td className="p-2 space-x-2"><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>save(s)}>Save</button><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>del(s.id)}>Delete</button></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
