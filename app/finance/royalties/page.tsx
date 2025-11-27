"use client"

import { useEffect, useState } from 'react'

type Royalty = { id: string; date: string; amount: number; authority: string }

export default function RoyaltiesPage() {
	const [items, setItems] = useState<Royalty[]>([])
	const [date, setDate] = useState('')
	const [amount, setAmount] = useState('')
	const [authority, setAuthority] = useState('')

	async function load() {
		const res = await fetch('/api/finance/royalties')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/finance/royalties', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: date || undefined, amount: Number(amount), authority }) })
		setDate(''); setAmount(''); setAuthority('')
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Royalty Payments</h1>
			<div className="flex gap-2">
				<input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={authority} onChange={(e)=>setAuthority(e.target.value)} placeholder="Authority" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount" className="input-shadow rounded px-2 py-1 w-32 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Create</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Date</th><th className="p-2">Authority</th><th className="p-2">Amount</th></tr></thead><tbody>
				{items.map(r => (<tr key={r.id} className="row-shadow"><td className="p-2">{new Date(r.date).toLocaleDateString()}</td><td className="p-2">{r.authority}</td><td className="p-2">{r.amount}</td></tr>))}
			</tbody></table>
		</div>
	)
}

