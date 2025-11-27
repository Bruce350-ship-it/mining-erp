"use client"

import { useEffect, useState } from 'react'

type Stock = { id: string; warehouse: { name: string }; inventoryItem: { sku: string; name: string; uom: string }; quantity: number; updatedAt: string }

export default function StockLevelsPage() {
	const [items, setItems] = useState<Stock[]>([])

	async function load() {
		const res = await fetch('/api/inventory/stock-levels')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Stock Levels</h1>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Warehouse</th><th className="p-2">Item</th><th className="p-2">SKU</th><th className="p-2">Qty</th><th className="p-2">UoM</th><th className="p-2">Updated</th></tr></thead>
				<tbody>
					{items.map(s => (
						<tr key={s.id} className="row-shadow"><td className="p-2">{s.warehouse.name}</td><td className="p-2">{s.inventoryItem.name}</td><td className="p-2">{s.inventoryItem.sku}</td><td className="p-2">{s.quantity}</td><td className="p-2">{s.inventoryItem.uom}</td><td className="p-2">{new Date(s.updatedAt).toLocaleString()}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

