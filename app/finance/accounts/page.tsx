"use client"

import { useEffect, useState } from 'react'

type Account = { id: string; code: string; name: string; type: string }

export default function AccountsPage() {
	const [items, setItems] = useState<Account[]>([])
	const [code, setCode] = useState('')
	const [name, setName] = useState('')
	const [type, setType] = useState('asset')

	async function load() {
		const res = await fetch('/api/finance/accounts')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/finance/accounts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, name, type }) })
		setCode(''); setName(''); setType('asset');
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">GL Accounts</h1>
			<div className="flex flex-wrap gap-2">
				<input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Code" className="input-shadow rounded px-2 py-1 w-28 bg-white" />
				<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="input-shadow rounded px-2 py-1 bg-white" />
				<select value={type} onChange={(e)=>setType(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white">
					<option value="asset">asset</option>
					<option value="liability">liability</option>
					<option value="equity">equity</option>
					<option value="income">income</option>
					<option value="expense">expense</option>
				</select>
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead>
					<tr className="bg-gray-50"><th className="p-2">Code</th><th className="p-2">Name</th><th className="p-2">Type</th></tr>
				</thead>
				<tbody>
					{items.map(a => (
						<tr key={a.id} className="row-shadow"><td className="p-2">{a.code}</td><td className="p-2">{a.name}</td><td className="p-2">{a.type}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

