"use client"

import { useEffect, useState } from 'react'

type Em = { id: string; type: string; amount: number; unit: string; date: string }

export default function EmissionsPage() {
	const [items, setItems] = useState<Em[]>([])
	const [type, setType] = useState('CO2')
	const [amount, setAmount] = useState('')
	const [unit, setUnit] = useState('t')

	async function load() {
		const res = await fetch('/api/environment/emissions')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/environment/emissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, amount: Number(amount), unit }) })
		setType('CO2'); setAmount(''); setUnit('t')
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Emissions</h1>
			<div className="flex gap-2 items-center">
				<input value={type} onChange={(e)=>setType(e.target.value)} placeholder="Type" className="input-shadow rounded px-2 py-1 w-24 bg-white" />
				<input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount" className="input-shadow rounded px-2 py-1 w-28 bg-white" />
				<input value={unit} onChange={(e)=>setUnit(e.target.value)} placeholder="Unit" className="input-shadow rounded px-2 py-1 w-20 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Date</th><th className="p-2">Type</th><th className="p-2">Amount</th><th className="p-2">Unit</th></tr></thead><tbody>
				{items.map(e => (<tr key={e.id} className="row-shadow"><td className="p-2">{new Date(e.date).toLocaleString()}</td><td className="p-2">{e.type}</td><td className="p-2">{e.amount}</td><td className="p-2">{e.unit}</td></tr>))}
			</tbody></table>
		</div>
	)
}

