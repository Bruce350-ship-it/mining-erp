"use client"

import { useEffect, useState } from 'react'

type Cert = { id: string; employeeId: string; name: string; issuedAt: string; expiresAt?: string | null }

export default function CertificationsPage() {
	const [items, setItems] = useState<Cert[]>([])
	const [employeeId, setEmployeeId] = useState('')
	const [name, setName] = useState('')
	const [issuedAt, setIssued] = useState('')
	const [expiresAt, setExpires] = useState('')

	async function load() {
		const res = await fetch('/api/hr/certifications')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/hr/certifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employeeId, name, issuedAt: issuedAt || undefined, expiresAt: expiresAt || undefined }) })
		setEmployeeId(''); setName(''); setIssued(''); setExpires('')
		await load()
	}

	async function remove(id: string) {
		await fetch(`/api/hr/certifications?id=${id}`, { method: 'DELETE' })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Certifications</h1>
			<div className="flex flex-wrap gap-2">
				<input value={employeeId} onChange={(e)=>setEmployeeId(e.target.value)} placeholder="Employee ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="date" value={issuedAt} onChange={(e)=>setIssued(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="date" value={expiresAt} onChange={(e)=>setExpires(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Issued</th><th className="p-2">Employee</th><th className="p-2">Name</th><th className="p-2">Expires</th><th className="p-2">Actions</th></tr></thead>
				<tbody>
					{items.map(c => (
						<tr key={c.id} className="row-shadow"><td className="p-2">{new Date(c.issuedAt).toLocaleDateString()}</td><td className="p-2">{c.employeeId}</td><td className="p-2">{c.name}</td><td className="p-2">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '-'}</td><td className="p-2"><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>remove(c.id)}>Delete</button></td></tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

