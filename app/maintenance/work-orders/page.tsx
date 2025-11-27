"use client"

import { useEffect, useState } from 'react'

type WO = { id: string; assetId: string; title: string; description?: string | null; status: string; createdAt: string; completedAt?: string | null }

export default function WorkOrdersPage() {
	const [items, setItems] = useState<WO[]>([])
	const [status, setStatus] = useState<string>('')
	const [assetId, setAssetId] = useState('')
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')

	async function load() {
		const url = status ? `/api/maintenance/work-orders?status=${encodeURIComponent(status)}` : '/api/maintenance/work-orders'
		const res = await fetch(url)
		setItems(await res.json())
	}
	useEffect(() => { load() }, [status])

	async function create() {
		await fetch('/api/maintenance/work-orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assetId, title, description: description || undefined }) })
		setAssetId(''); setTitle(''); setDescription('')
		await load()
	}

	async function closeWO(id: string) {
		await fetch('/api/maintenance/work-orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'closed' }) })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Work Orders</h1>
			<div className="flex items-center gap-2">
				<select value={status} onChange={(e)=>setStatus(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white">
					<option value="">All</option>
					<option value="open">Open</option>
					<option value="closed">Closed</option>
				</select>
			</div>
			<div className="flex flex-wrap gap-2">
				<input value={assetId} onChange={(e)=>setAssetId(e.target.value)} placeholder="Asset ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="input-shadow rounded px-2 py-1 w-64 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Create</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Created</th><th className="p-2">Asset</th><th className="p-2">Title</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
				<tbody>
					{items.map(w => (
						<tr key={w.id} className="row-shadow"><td className="p-2">{new Date(w.createdAt).toLocaleString()}</td><td className="p-2">{w.assetId}</td><td className="p-2">{w.title}</td><td className="p-2">{w.status}</td><td className="p-2">{w.status !== 'closed' && <button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>closeWO(w.id)}>Close</button>}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

