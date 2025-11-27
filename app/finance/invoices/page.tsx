"use client"

import { useEffect, useState } from 'react'

type Invoice = { id: string; supplierId?: string | null; date: string; amount: number; status: string }

export default function InvoicesPage() {
	const [items, setItems] = useState<Invoice[]>([])
	const [supplierId, setSupplier] = useState('')
	const [date, setDate] = useState('')
	const [amount, setAmount] = useState('')

	async function load() {
		const res = await fetch('/api/finance/invoices')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/finance/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ supplierId: supplierId || undefined, date: date || undefined, amount: Number(amount) }) })
		setSupplier(''); setDate(''); setAmount('')
		await load()
	}

	async function closeInvoice(id: string) {
		await fetch('/api/finance/invoices', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'closed' }) })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Invoices</h1>
			<div className="flex gap-2">
				<input value={supplierId} onChange={(e)=>setSupplier(e.target.value)} placeholder="Supplier ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount" className="input-shadow rounded px-2 py-1 w-32 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Create</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Date</th><th className="p-2">Supplier</th><th className="p-2">Amount</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead><tbody>
				{items.map(i => (<tr key={i.id} className="row-shadow"><td className="p-2">{new Date(i.date).toLocaleDateString()}</td><td className="p-2">{i.supplierId ?? '-'}</td><td className="p-2">{i.amount}</td><td className="p-2">{i.status}</td><td className="p-2">{i.status !== 'closed' && <button className="rounded shadow-sm hover:shadow-md px-2 py-1" onClick={()=>closeInvoice(i.id)}>Close</button>}</td></tr>))}
			</tbody></table>
		</div>
	)
}

