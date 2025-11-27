"use client"

import { useEffect, useState } from 'react'

type Grade = { id: string; pitId: string; date: string; gradeAu?: number | null; gradeCu?: number | null; gradeFe?: number | null }

export default function OreGradesPage() {
	const [items, setItems] = useState<Grade[]>([])
	const [pitId, setPitId] = useState('')
	const [gradeAu, setAu] = useState<string>('')
	const [gradeCu, setCu] = useState<string>('')
	const [gradeFe, setFe] = useState<string>('')

	async function load() {
		const res = await fetch('/api/operations/ore-grades')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/operations/ore-grades', {
			method: 'POST', headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ pitId, gradeAu: gradeAu ? Number(gradeAu) : null, gradeCu: gradeCu ? Number(gradeCu) : null, gradeFe: gradeFe ? Number(gradeFe) : null }),
		})
		setPitId(''); setAu(''); setCu(''); setFe('');
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Ore Grades</h1>
			<div className="flex flex-wrap gap-2">
				<input value={pitId} onChange={(e)=>setPitId(e.target.value)} placeholder="Pit ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<input value={gradeAu} onChange={(e)=>setAu(e.target.value)} placeholder="Au" className="input-shadow rounded px-2 py-1 w-24 bg-white" />
				<input value={gradeCu} onChange={(e)=>setCu(e.target.value)} placeholder="Cu" className="input-shadow rounded px-2 py-1 w-24 bg-white" />
				<input value={gradeFe} onChange={(e)=>setFe(e.target.value)} placeholder="Fe" className="input-shadow rounded px-2 py-1 w-24 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Add</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead><tr className="bg-gray-50"><th className="p-2">Date</th><th className="p-2">Pit</th><th className="p-2">Au</th><th className="p-2">Cu</th><th className="p-2">Fe</th></tr></thead>
				<tbody>
					{items.map(g => (
						<tr key={g.id} className="row-shadow"><td className="p-2">{new Date(g.date).toLocaleString()}</td><td className="p-2">{g.pitId}</td><td className="p-2">{g.gradeAu ?? '-'}</td><td className="p-2">{g.gradeCu ?? '-'}</td><td className="p-2">{g.gradeFe ?? '-'}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

