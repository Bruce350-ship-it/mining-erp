"use client"

import { useEffect, useState } from 'react'

type Incident = { id: string; reportedAt: string; siteId?: string | null; severity: string; description?: string | null }

export default function IncidentsPage() {
	const [items, setItems] = useState<Incident[]>([])
	const [siteId, setSiteId] = useState('')
	const [severity, setSeverity] = useState('medium')
	const [description, setDescription] = useState('')

	async function load() {
		const res = await fetch('/api/safety/incidents')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/safety/incidents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ siteId: siteId || undefined, severity, description }) })
		setSiteId(''); setSeverity('medium'); setDescription('');
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Safety Incidents</h1>
			<div className="flex flex-wrap gap-2">
				<input value={siteId} onChange={(e)=>setSiteId(e.target.value)} placeholder="Site ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<select value={severity} onChange={(e)=>setSeverity(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white">
					<option value="low">low</option>
					<option value="medium">medium</option>
					<option value="high">high</option>
				</select>
				<input value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="input-shadow rounded px-2 py-1 w-64 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Log</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Reported</th><th className="p-2">Site</th><th className="p-2">Severity</th><th className="p-2">Description</th></tr></thead>
				<tbody>
					{items.map(i => (
						<tr key={i.id} className="row-shadow"><td className="p-2">{new Date(i.reportedAt).toLocaleString()}</td><td className="p-2">{i.siteId ?? '-'}</td><td className="p-2">{i.severity}</td><td className="p-2">{i.description}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

