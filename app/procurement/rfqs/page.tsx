"use client"

import { useEffect, useState } from 'react'

type RFQ = { id: string; title: string; supplierId?: string | null; createdAt: string }

export default function RFQsPage() {
	const [items, setItems] = useState<RFQ[]>([])
	const [title, setTitle] = useState('')
	const [supplierId, setSupplierId] = useState('')

	async function load() {
		const res = await fetch('/api/procurement/rfqs')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/procurement/rfqs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, supplierId: supplierId || undefined }) })
		setTitle(''); setSupplierId('')
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">RFQs</h1>
			<div className="flex gap-2">
				<input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={supplierId} onChange={(e)=>setSupplierId(e.target.value)} placeholder="Supplier ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Create</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Created</th><th className="p-2">Title</th><th className="p-2">Supplier</th></tr></thead><tbody>
				{items.map(r => (<tr key={r.id} className="row-shadow"><td className="p-2">{new Date(r.createdAt).toLocaleString()}</td><td className="p-2">{r.title}</td><td className="p-2">{r.supplierId ?? '-'}</td></tr>))}
			</tbody></table>
		</div>
	)
}

