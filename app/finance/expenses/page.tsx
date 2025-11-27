"use client"

import { useEffect, useState } from 'react'

type Expense = { id: string; costCenterId?: string | null; date: string; amount: number; description?: string | null }

export default function ExpensesPage() {
	const [items, setItems] = useState<Expense[]>([])
	const [costCenterId, setCC] = useState('')
	const [date, setDate] = useState('')
	const [amount, setAmount] = useState('')
	const [description, setDesc] = useState('')

	async function load() {
		const res = await fetch('/api/finance/expenses')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/finance/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ costCenterId: costCenterId || undefined, date: date || undefined, amount: Number(amount), description: description || undefined }) })
		setCC(''); setDate(''); setAmount(''); setDesc('')
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Expenses</h1>
			<div className="flex gap-2">
				<input value={costCenterId} onChange={(e)=>setCC(e.target.value)} placeholder="Cost Center ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount" className="input-shadow rounded px-2 py-1 w-32 bg-white" />
				<input value={description} onChange={(e)=>setDesc(e.target.value)} placeholder="Description" className="input-shadow rounded px-2 py-1 w-64 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Create</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Date</th><th className="p-2">Cost Center</th><th className="p-2">Amount</th><th className="p-2">Description</th></tr></thead><tbody>
				{items.map(x => (<tr key={x.id} className="row-shadow"><td className="p-2">{new Date(x.date).toLocaleDateString()}</td><td className="p-2">{x.costCenterId ?? '-'}</td><td className="p-2">{x.amount}</td><td className="p-2">{x.description}</td></tr>))}
			</tbody></table>
		</div>
	)
}

