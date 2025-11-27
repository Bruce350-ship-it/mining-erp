"use client"

import { useEffect, useState } from 'react'

type Equipment = {
	id: string
	code: string
	name: string
	type: string
	status: string
	latitude?: number | null
	longitude?: number | null
	lastKnownAt?: string | null
}

export default function EquipmentPage() {
	const [items, setItems] = useState<Equipment[]>([])
	const [editing, setEditing] = useState<Record<string, { latitude?: string; longitude?: string }>>({})

	async function load() {
		const res = await fetch('/api/operations/equipment')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	function setField(id: string, key: 'latitude' | 'longitude', value: string) {
		setEditing(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [key]: value } }))
	}

	async function save(item: Equipment) {
		const e = editing[item.id] || {}
		await fetch('/api/operations/equipment', {
			method: 'PUT', headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: item.id, latitude: e.latitude ? Number(e.latitude) : null, longitude: e.longitude ? Number(e.longitude) : null, lastKnownAt: new Date().toISOString() })
		})
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Equipment</h1>
			<table className="w-full text-left table-shadow">
				<thead>
					<tr className="bg-gray-50"><th className="p-2">Code</th><th className="p-2">Name</th><th className="p-2">Status</th><th className="p-2">Latitude</th><th className="p-2">Longitude</th><th className="p-2">Last Known</th><th className="p-2">Actions</th></tr>
				</thead>
				<tbody>
					{items.map(it => (
						<tr key={it.id} className="row-shadow">
							<td className="p-2">{it.code}</td>
							<td className="p-2">{it.name}</td>
							<td className="p-2">{it.status}</td>
							<td className="p-2">
								<input className="input-shadow rounded px-2 py-1 w-28 bg-white" value={editing[it.id]?.latitude ?? (it.latitude ?? '')} onChange={(e)=>setField(it.id,'latitude',e.target.value)} />
							</td>
							<td className="p-2">
								<input className="input-shadow rounded px-2 py-1 w-28 bg-white" value={editing[it.id]?.longitude ?? (it.longitude ?? '')} onChange={(e)=>setField(it.id,'longitude',e.target.value)} />
							</td>
							<td className="p-2">{it.lastKnownAt ? new Date(it.lastKnownAt).toLocaleString() : '-'}</td>
							<td className="p-2">
								<button className="rounded bg-black text-white px-3 py-1" onClick={()=>save(it)}>Save</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

