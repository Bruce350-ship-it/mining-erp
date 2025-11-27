"use client"

import { useEffect, useState } from 'react'

type Tax = { id: string; periodFrom: string; periodTo: string; amount: number; createdAt: string }

export default function TaxReportsPage() {
	const [items, setItems] = useState<Tax[]>([])
	const [from, setFrom] = useState('')
	const [to, setTo] = useState('')
	const [amount, setAmount] = useState('')

	async function load() {
		const res = await fetch('/api/finance/tax-reports')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/finance/tax-reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ periodFrom: from, periodTo: to, amount: Number(amount) }) })
		setFrom(''); setTo(''); setAmount('')
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Tax Reports</h1>
			<div className="flex gap-2">
				<input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="date" value={to} onChange={(e)=>setTo(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount" className="input-shadow rounded px-2 py-1 w-32 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Create</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Period</th><th className="p-2">Amount</th><th className="p-2">Created</th></tr></thead><tbody>
				{items.map(t => (<tr key={t.id} className="row-shadow"><td className="p-2">{new Date(t.periodFrom).toLocaleDateString()} - {new Date(t.periodTo).toLocaleDateString()}</td><td className="p-2">{t.amount}</td><td className="p-2">{new Date(t.createdAt).toLocaleString()}</td></tr>))}
			</tbody></table>
		</div>
	)
}

