"use client"

import { useEffect, useState } from 'react'

type Entry = { id: string; date: string; reference?: string | null; lines: Array<{ id: string; accountId: string; debit: number; credit: number; costCenterId?: string | null }> }

type Line = { accountId: string; debit: number; credit: number; costCenterId?: string }

export default function JournalPage() {
	const [entries, setEntries] = useState<Entry[]>([])
	const [reference, setReference] = useState('')
	const [lines, setLines] = useState<Line[]>([{ accountId: '', debit: 0, credit: 0 }])

	async function load() {
		const res = await fetch('/api/finance/journal')
		setEntries(await res.json())
	}
	useEffect(() => { load() }, [])

	function updateLine(i: number, patch: Partial<Line>) {
		setLines(prev => prev.map((l, idx) => idx === i ? { ...l, ...patch } : l))
	}

	function addLine() { setLines(prev => [...prev, { accountId: '', debit: 0, credit: 0 }]) }

	async function create() {
		await fetch('/api/finance/journal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reference, lines }) })
		setReference(''); setLines([{ accountId: '', debit: 0, credit: 0 }])
		await load()
	}

	const totalDebit = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0)
	const totalCredit = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0)

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Journal</h1>
			<div className="space-y-2">
				<input value={reference} onChange={(e)=>setReference(e.target.value)} placeholder="Reference" className="input-shadow rounded px-2 py-1 bg-white" />
				<div className="space-y-2">
					{lines.map((l, i) => (
						<div key={i} className="flex gap-2">
							<input value={l.accountId} onChange={(e)=>updateLine(i, { accountId: e.target.value })} placeholder="Account ID" className="input-shadow rounded px-2 py-1 bg-white" />
							<input type="number" value={l.debit} onChange={(e)=>updateLine(i, { debit: Number(e.target.value) })} placeholder="Debit" className="input-shadow rounded px-2 py-1 w-28 bg-white" />
							<input type="number" value={l.credit} onChange={(e)=>updateLine(i, { credit: Number(e.target.value) })} placeholder="Credit" className="input-shadow rounded px-2 py-1 w-28 bg-white" />
						</div>
					))}
				</div>
				<div className="flex items-center gap-4">
					<div className="text-sm">Totals: Debit {totalDebit} / Credit {totalCredit}</div>
					<button onClick={addLine} className="rounded border px-3 py-1">Add line</button>
					<button onClick={create} className="rounded bg-black text-white px-3 py-1">Post</button>
				</div>
			</div>

			{entries.map(e => (
				<div key={e.id} className="card-shadow rounded p-4 space-y-2">
					<div className="flex justify-between"><span className="font-medium">{new Date(e.date).toLocaleString()}</span><span>{e.reference}</span></div>
					<table className="w-full text-left table-shadow">
						<thead><tr className="bg-gray-50"><th className="p-2">Account</th><th className="p-2">Debit</th><th className="p-2">Credit</th></tr></thead>
						<tbody>
							{e.lines.map(l => (
								<tr key={l.id} className="row-shadow"><td className="p-2">{l.accountId}</td><td className="p-2">{l.debit}</td><td className="p-2">{l.credit}</td></tr>
							))}
						</tbody>
					</table>
				</div>
			))}
		</div>
	)
}

