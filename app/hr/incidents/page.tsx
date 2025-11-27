"use client"

import { useEffect, useState } from 'react'

type HRIncident = { id: string; employeeId: string; type: string; details?: string | null; date: string }

export default function HRIncidentsPage() {
	const [items, setItems] = useState<HRIncident[]>([])
	const [employeeId, setEmployeeId] = useState('')
	const [type, setType] = useState('disciplinary')
	const [details, setDetails] = useState('')

	async function load() {
		const res = await fetch('/api/hr/incidents')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/hr/incidents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employeeId, type, details: details || undefined }) })
		setEmployeeId(''); setType('disciplinary'); setDetails('')
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">HR Incident Reports</h1>
			<div className="flex flex-wrap gap-2">
				<input value={employeeId} onChange={(e)=>setEmployeeId(e.target.value)} placeholder="Employee ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={type} onChange={(e)=>setType(e.target.value)} placeholder="Type" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={details} onChange={(e)=>setDetails(e.target.value)} placeholder="Details" className="input-shadow rounded px-2 py-1 w-64 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Create</button>
			</div>
			<table className="w-full text-left table-shadow"><thead><tr className="bg-gray-50"><th className="p-2">Date</th><th className="p-2">Employee</th><th className="p-2">Type</th><th className="p-2">Details</th></tr></thead><tbody>
				{items.map(i => (<tr key={i.id} className="row-shadow"><td className="p-2">{new Date(i.date).toLocaleString()}</td><td className="p-2">{i.employeeId}</td><td className="p-2">{i.type}</td><td className="p-2">{i.details}</td></tr>))}
			</tbody></table>
		</div>
	)
}

