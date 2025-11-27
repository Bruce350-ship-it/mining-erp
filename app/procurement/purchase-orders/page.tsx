"use client"

import { useEffect, useState } from 'react'

type PO = { id: string; supplierId: string; status: string; createdAt: string }

export default function PurchaseOrdersPage() {
	const [items, setItems] = useState<PO[]>([])
	const [supplierId, setSupplierId] = useState('')

	async function load() {
		const res = await fetch('/api/procurement/purchase-orders')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/procurement/purchase-orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ supplierId }) })
		setSupplierId('')
		await load()
	}

	async function closePo(id: string) {
		await fetch('/api/procurement/purchase-orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'closed' }) })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Purchase Orders</h1>
			<div className="flex gap-2">
				<input value={supplierId} onChange={(e)=>setSupplierId(e.target.value)} placeholder="Supplier ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Create</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Created</th><th className="p-2">Supplier</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead><tbody>
				{items.map(po => (
					<tr key={po.id} className="row-shadow"><td className="p-2">{new Date(po.createdAt).toLocaleString()}</td><td className="p-2">{po.supplierId}</td><td className="p-2">{po.status}</td><td className="p-2">{po.status !== 'closed' && <button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>closePo(po.id)}>Close</button>}</td></tr>
				))}
			</tbody></table>
		</div>
	)
}

