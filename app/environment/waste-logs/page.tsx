"use client"

import { useEffect, useState } from 'react'

type Waste = { id: string; type: string; quantity: number; unit: string; date: string; disposed: boolean }

export default function WasteLogsPage() {
	const [items, setItems] = useState<Waste[]>([])
	const [type, setType] = useState('hazardous')
	const [quantity, setQty] = useState('')
	const [unit, setUnit] = useState('kg')

	async function load() {
		const res = await fetch('/api/environment/waste-logs')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/environment/waste-logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, quantity: Number(quantity), unit }) })
		setType('hazardous'); setQty(''); setUnit('kg')
		await load()
	}

	async function markDisposed(id: string, disposed: boolean) {
		await fetch('/api/environment/waste-logs', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, disposed }) })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Waste Logs</h1>
			<div className="flex gap-2 items-center">
				<input value={type} onChange={(e)=>setType(e.target.value)} placeholder="Type" className="input-shadow rounded px-2 py-1 w-32 bg-white" />
				<input value={quantity} onChange={(e)=>setQty(e.target.value)} placeholder="Quantity" className="input-shadow rounded px-2 py-1 w-28 bg-white" />
				<input value={unit} onChange={(e)=>setUnit(e.target.value)} placeholder="Unit" className="input-shadow rounded px-2 py-1 w-20 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Date</th><th className="p-2">Type</th><th className="p-2">Qty</th><th className="p-2">Unit</th><th className="p-2">Disposed</th><th className="p-2">Actions</th></tr></thead><tbody>
				{items.map(w => (
					<tr key={w.id} className="row-shadow"><td className="p-2">{new Date(w.date).toLocaleString()}</td><td className="p-2">{w.type}</td><td className="p-2">{w.quantity}</td><td className="p-2">{w.unit}</td><td className="p-2">{w.disposed ? 'Yes' : 'No'}</td><td className="p-2 space-x-2"><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>markDisposed(w.id,true)}>Mark disposed</button><button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>markDisposed(w.id,false)}>Reopen</button></td></tr>
				))}
			</tbody></table>
		</div>
	)
}

