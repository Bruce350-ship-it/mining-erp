"use client"

import { useEffect, useState } from 'react'

type Attendance = {
	id: string
	employeeId: string
	checkIn: string
	checkOut?: string | null
}

export default function AttendancePage() {
	const [items, setItems] = useState<Attendance[]>([])
	const [employeeId, setEmployeeId] = useState('')
	const [checkIn, setCheckIn] = useState('')
	const [checkOut, setCheckOut] = useState('')

	async function load() {
		const res = await fetch('/api/hr/attendance')
		setItems(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/hr/attendance', {
			method: 'POST', headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ employeeId, checkIn, checkOut: checkOut || undefined })
		})
		setEmployeeId(''); setCheckIn(''); setCheckOut('');
		await load()
	}

	async function quick(action: 'checkin' | 'checkout') {
		await fetch('/api/hr/attendance/now', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employeeId, action }) })
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Attendance</h1>
			<div className="flex flex-wrap gap-2 items-center">
				<input value={employeeId} onChange={(e)=>setEmployeeId(e.target.value)} placeholder="Employee ID" className="input-shadow rounded px-2 py-1 bg-white" />
				<button onClick={()=>quick('checkin')} className="rounded border px-3 py-1">Check-in now</button>
				<button onClick={()=>quick('checkout')} className="rounded border px-3 py-1">Check-out now</button>
			</div>
			<div className="flex flex-wrap gap-2">
				<input type="datetime-local" value={checkIn} onChange={(e)=>setCheckIn(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="datetime-local" value={checkOut} onChange={(e)=>setCheckOut(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Log</button>
			</div>
			<table className="w-full text-left table-shadow">
				<thead>
					<tr className="bg-gray-50">
						<th className="p-2">Check In</th>
						<th className="p-2">Check Out</th>
						<th className="p-2">Employee</th>
					</tr>
				</thead>
				<tbody>
					{items.map(a => (
						<tr key={a.id} className="row-shadow">
							<td className="p-2">{new Date(a.checkIn).toLocaleString()}</td>
							<td className="p-2">{a.checkOut ? new Date(a.checkOut).toLocaleString() : '-'}</td>
							<td className="p-2">{a.employeeId}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
