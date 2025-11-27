"use client"

import { useEffect, useState } from 'react'

type Receipt = {
	id: string
	purchaseOrderId: string
	warehouseId: string
	inventoryItemId: string
	quantity: number
	receivedAt: string
}

export default function ReceiptsPage() {
	const [items, setItems] = useState<Receipt[]>([])
	const [purchaseOrderId, setPO] = useState('')
	const [warehouseId, setWarehouse] = useState('')
	const [inventoryItemId, setItem] = useState('')
	const [quantity, setQty] = useState(0)

	async function load() {
		const res = await fetch('/api/inventory/receipts')
		setItems(await res.json())
	}

	useEffect(() => {
		load()
	}, [])

	async function create() {
		await fetch('/api/inventory/receipts', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ purchaseOrderId, warehouseId, inventoryItemId, quantity: Number(quantity) }),
		})
		setPO('')
		setWarehouse('')
		setItem('')
		setQty(0)
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Receipts</h1>
			<div className="flex flex-wrap gap-2">
				<input value={purchaseOrderId} onChange={(e) => setPO(e.target.value)} placeholder="PO ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={warehouseId} onChange={(e) => setWarehouse(e.target.value)} placeholder="Warehouse ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={inventoryItemId} onChange={(e) => setItem(e.target.value)} placeholder="Item ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="number" value={quantity} onChange={(e) => setQty(Number(e.target.value))} placeholder="Qty" className="input-shadow rounded px-2 py-1 w-28 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Receive</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead>
					<tr className="bg-gray-50">
						<th className="p-2">Date</th>
						<th className="p-2">PO</th>
						<th className="p-2">Warehouse</th>
						<th className="p-2">Item</th>
						<th className="p-2">Qty</th>
					</tr>
				</thead>
				<tbody>
					{items.map((r) => (
						<tr key={r.id} className="row-shadow">
							<td className="p-2">{new Date(r.receivedAt).toLocaleString()}</td>
							<td className="p-2">{r.purchaseOrderId}</td>
							<td className="p-2">{r.warehouseId}</td>
							<td className="p-2">{r.inventoryItemId}</td>
							<td className="p-2">{r.quantity}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

