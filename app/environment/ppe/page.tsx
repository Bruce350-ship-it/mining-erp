"use client"

import { useEffect, useState } from 'react'

type PPE = { id: string; employeeId: string; item: string; quantity: number; issuedAt: string }

export default function PPEIssuedPage() {
	const [items, setItems] = useState<PPE[]>([])
	const [employeeId, setEmployee] = useState('')
	const [item, setItem] = useState('Helmet')
	const [quantity, setQty] = useState(1)

	async function load() {
		const res = await fetch('/api/environment/ppe')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/environment/ppe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employeeId, item, quantity: Number(quantity) }) })
		setEmployee(''); setItem('Helmet'); setQty(1)
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">PPE Issued</h1>
			<div className="flex flex-wrap gap-2 items-center">
				<input value={employeeId} onChange={(e)=>setEmployee(e.target.value)} placeholder="Employee ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={item} onChange={(e)=>setItem(e.target.value)} placeholder="Item" className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="number" value={quantity} onChange={(e)=>setQty(Number(e.target.value))} className="input-shadow rounded px-2 py-1 w-24 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Issue</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Issued</th><th className="p-2">Employee</th><th className="p-2">Item</th><th className="p-2">Qty</th></tr></thead><tbody>
				{items.map(p => (<tr key={p.id} className="row-shadow"><td className="p-2">{new Date(p.issuedAt).toLocaleString()}</td><td className="p-2">{p.employeeId}</td><td className="p-2">{p.item}</td><td className="p-2">{p.quantity}</td></tr>))}
			</tbody></table>
		</div>
	)
}

