"use client"

import { useEffect, useState } from 'react'

type Insp = { id: string; siteId?: string | null; type: string; findings?: string | null; passed: boolean; date: string }

export default function InspectionsPage() {
	const [items, setItems] = useState<Insp[]>([])
	const [siteId, setSite] = useState('')
	const [type, setType] = useState('safety')
	const [findings, setFindings] = useState('')
	const [passed, setPassed] = useState(false)

	async function load() {
		const res = await fetch('/api/environment/inspections')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/environment/inspections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ siteId: siteId || undefined, type, findings: findings || undefined, passed }) })
		setSite(''); setType('safety'); setFindings(''); setPassed(false)
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Inspections</h1>
			<div className="flex flex-wrap gap-2 items-center">
				<input value={siteId} onChange={(e)=>setSite(e.target.value)} placeholder="Site ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={type} onChange={(e)=>setType(e.target.value)} placeholder="Type" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={findings} onChange={(e)=>setFindings(e.target.value)} placeholder="Findings" className="input-shadow rounded px-2 py-1 w-64 bg-white" />
				<label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={passed} onChange={(e)=>setPassed(e.target.checked)} /> Passed</label>
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Create</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Date</th><th className="p-2">Site</th><th className="p-2">Type</th><th className="p-2">Passed</th><th className="p-2">Findings</th></tr></thead><tbody>
				{items.map(x => (<tr key={x.id} className="row-shadow"><td className="p-2">{new Date(x.date).toLocaleString()}</td><td className="p-2">{x.siteId ?? '-'}</td><td className="p-2">{x.type}</td><td className="p-2">{x.passed ? 'Yes' : 'No'}</td><td className="p-2">{x.findings}</td></tr>))}
			</tbody></table>
		</div>
	)
}

