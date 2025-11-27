"use client"

import { useEffect, useState } from 'react'

type Emp = { id: string; firstName: string; lastName: string; email?: string | null; phone?: string | null; active: boolean; hireDate: string }

export default function EmployeesPage() {
	const [items, setItems] = useState<Emp[]>([])
	const [firstName, setFirst] = useState('')
	const [lastName, setLast] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [editing, setEditing] = useState<Record<string, Partial<Emp>>>({})

	async function load() {
		const res = await fetch('/api/hr/employees')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/hr/employees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName, lastName, email: email || undefined, phone: phone || undefined }) })
		setFirst(''); setLast(''); setEmail(''); setPhone('')
		await load()
	}

	async function save(e: Emp) {
		const p = editing[e.id] || {}
		await fetch('/api/hr/employees', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: e.id, firstName: p.firstName ?? e.firstName, lastName: p.lastName ?? e.lastName, email: p.email ?? e.email ?? undefined, phone: p.phone ?? e.phone ?? undefined, active: typeof p.active === 'boolean' ? p.active : e.active }) })
		await load()
	}

	async function del(id: string) {
		await fetch(`/api/hr/employees?id=${id}`, { method: 'DELETE' })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Employees</h1>
			<div className="flex flex-wrap gap-2">
				<input value={firstName} onChange={(e)=>setFirst(e.target.value)} placeholder="First name" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={lastName} onChange={(e)=>setLast(e.target.value)} placeholder="Last name" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone" className="input-shadow rounded px-2 py-1 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Phone</th><th className="p-2">Active</th><th className="p-2">Hired</th><th className="p-2">Actions</th></tr></thead>
				<tbody>
					{items.map(emp => (
						<tr key={emp.id} className="row-shadow">
							<td className="p-2">
								<input className="input-shadow rounded px-2 py-1 w-28 bg-white" value={(editing[emp.id]?.firstName as string) ?? emp.firstName} onChange={(e)=>setEditing(p=>({ ...p, [emp.id]: { ...(p[emp.id]||{}), firstName: e.target.value } }))} />
								<input className="input-shadow rounded px-2 py-1 w-28 ml-2 bg-white" value={(editing[emp.id]?.lastName as string) ?? emp.lastName} onChange={(e)=>setEditing(p=>({ ...p, [emp.id]: { ...(p[emp.id]||{}), lastName: e.target.value } }))} />
							</td>
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={(editing[emp.id]?.email as string) ?? (emp.email ?? '')} onChange={(e)=>setEditing(p=>({ ...p, [emp.id]: { ...(p[emp.id]||{}), email: e.target.value } }))} /></td>
							<td className="p-2"><input className="input-shadow rounded px-2 py-1 bg-white" value={(editing[emp.id]?.phone as string) ?? (emp.phone ?? '')} onChange={(e)=>setEditing(p=>({ ...p, [emp.id]: { ...(p[emp.id]||{}), phone: e.target.value } }))} /></td>
							<td className="p-2"><input type="checkbox" checked={(editing[emp.id]?.active as boolean) ?? emp.active} onChange={(e)=>setEditing(p=>({ ...p, [emp.id]: { ...(p[emp.id]||{}), active: e.target.checked } }))} /></td>
							<td className="p-2">{new Date(emp.hireDate).toLocaleDateString()}</td>
							<td className="p-2 space-x-2"><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>save(emp)}>Save</button><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>del(emp.id)}>Delete</button></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

