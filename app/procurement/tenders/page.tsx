"use client"

import { useEffect, useState } from 'react'

type Tender = { id: string; rfqId?: string | null; supplierId?: string | null; amount?: number | null; status: string; createdAt: string }

export default function TendersPage() {
	const [items, setItems] = useState<Tender[]>([])
	const [rfqId, setRfqId] = useState('')
	const [supplierId, setSupplierId] = useState('')
	const [amount, setAmount] = useState('')

	async function load() {
		const res = await fetch('/api/procurement/tenders')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/procurement/tenders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rfqId: rfqId || undefined, supplierId: supplierId || undefined, amount: amount ? Number(amount) : undefined }) })
		setRfqId(''); setSupplierId(''); setAmount('')
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Tenders</h1>
			<div className="flex gap-2">
				<input value={rfqId} onChange={(e)=>setRfqId(e.target.value)} placeholder="RFQ ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={supplierId} onChange={(e)=>setSupplierId(e.target.value)} placeholder="Supplier ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount" className="input-shadow rounded px-2 py-1 w-32 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Create</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Created</th><th className="p-2">RFQ</th><th className="p-2">Supplier</th><th className="p-2">Amount</th><th className="p-2">Status</th></tr></thead><tbody>
				{items.map(t => (<tr key={t.id} className="row-shadow"><td className="p-2">{new Date(t.createdAt).toLocaleString()}</td><td className="p-2">{t.rfqId ?? '-'}</td><td className="p-2">{t.supplierId ?? '-'}</td><td className="p-2">{t.amount ?? '-'}</td><td className="p-2">{t.status}</td></tr>))}
			</tbody></table>
		</div>
	)
}

