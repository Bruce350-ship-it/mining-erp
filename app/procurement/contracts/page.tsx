"use client"

import { useEffect, useState } from 'react'

type Contract = { id: string; tenderId?: string | null; supplierId?: string | null; startDate?: string | null; endDate?: string | null; value?: number | null; createdAt: string }

export default function ContractsPage() {
	const [items, setItems] = useState<Contract[]>([])
	const [tenderId, setTenderId] = useState('')
	const [supplierId, setSupplierId] = useState('')
	const [startDate, setStart] = useState('')
	const [endDate, setEnd] = useState('')
	const [value, setValue] = useState('')

	async function load() {
		const res = await fetch('/api/procurement/contracts')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/procurement/contracts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenderId: tenderId || undefined, supplierId: supplierId || undefined, startDate: startDate || undefined, endDate: endDate || undefined, value: value ? Number(value) : undefined }) })
		setTenderId(''); setSupplierId(''); setStart(''); setEnd(''); setValue('')
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Contracts</h1>
			<div className="flex gap-2">
				<input value={tenderId} onChange={(e)=>setTenderId(e.target.value)} placeholder="Tender ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={supplierId} onChange={(e)=>setSupplierId(e.target.value)} placeholder="Supplier ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="date" value={startDate} onChange={(e)=>setStart(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="date" value={endDate} onChange={(e)=>setEnd(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={value} onChange={(e)=>setValue(e.target.value)} placeholder="Value" className="input-shadow rounded px-2 py-1 w-32 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Create</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Created</th><th className="p-2">Tender</th><th className="p-2">Supplier</th><th className="p-2">Start</th><th className="p-2">End</th><th className="p-2">Value</th></tr></thead><tbody>
				{items.map(c => (<tr key={c.id} className="row-shadow"><td className="p-2">{new Date(c.createdAt).toLocaleString()}</td><td className="p-2">{c.tenderId ?? '-'}</td><td className="p-2">{c.supplierId ?? '-'}</td><td className="p-2">{c.startDate ? new Date(c.startDate).toLocaleDateString() : '-'}</td><td className="p-2">{c.endDate ? new Date(c.endDate).toLocaleDateString() : '-'}</td><td className="p-2">{c.value ?? '-'}</td></tr>))}
			</tbody></table>
		</div>
	)
}

