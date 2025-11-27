"use client"

import { useEffect, useState } from 'react'

type Run = {
	id: string
	periodFrom: string
	periodTo: string
	createdAt: string
	processed: boolean
	lines: Array<{
		id: string
		employeeId: string
		basicPay: number
		allowances: number
		deductions: number
		netPay: number
		allowanceItems?: Array<{ id: string; name: string; amount: number }>
		deductionItems?: Array<{ id: string; name: string; amount: number }>
	}>
}

export default function PayrollRunsPage() {
	const [runs, setRuns] = useState<Run[]>([])
	const [from, setFrom] = useState('')
	const [to, setTo] = useState('')

	async function load() {
		const res = await fetch('/api/payroll/runs')
		setRuns(await res.json())
	}
	useEffect(() => { load() }, [])

	async function create() {
		await fetch('/api/payroll/runs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ periodFrom: from, periodTo: to }) })
		setFrom(''); setTo('');
		await load()
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Payroll Runs</h1>
			<div className="flex gap-2">
				<input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<input type="date" value={to} onChange={(e)=>setTo(e.target.value)} className="input-shadow rounded px-2 py-1 bg-white" />
				<button onClick={create} className="rounded bg-black text-white px-3 py-1">Create</button>
			</div>
			{runs.map(run => (
				<div key={run.id} className="card-shadow rounded p-4 space-y-2">
					<div className="flex justify-between">
						<div>
							<p className="font-medium">{new Date(run.periodFrom).toLocaleDateString()} - {new Date(run.periodTo).toLocaleDateString()}</p>
							<p className="text-sm text-gray-500">{new Date(run.createdAt).toLocaleString()}</p>
						</div>
						<span className="text-sm">{run.processed ? 'Processed' : 'Draft'}</span>
					</div>
					<table className="w-full text-left table-shadow">
						<thead>
							<tr className="bg-gray-50"><th className="p-2">Employee</th><th className="p-2">Basic</th><th className="p-2">Allowances</th><th className="p-2">Deductions</th><th className="p-2">Net</th></tr>
						</thead>
						<tbody>
							{run.lines.map(l => (
								<tr key={l.id} className="border-t align-top">
									<td className="p-2">{l.employeeId}</td>
									<td className="p-2">{l.basicPay}</td>
									<td className="p-2">
										<div>{l.allowances}</div>
										{l.allowanceItems && l.allowanceItems.length > 0 && (
											<ul className="text-xs text-gray-600 list-disc ml-4">
												{l.allowanceItems.map(a => (<li key={a.id}>{a.name}: {a.amount}</li>))}
											</ul>
										)}
									</td>
									<td className="p-2">
										<div>{l.deductions}</div>
										{l.deductionItems && l.deductionItems.length > 0 && (
											<ul className="text-xs text-gray-600 list-disc ml-4">
												{l.deductionItems.map(d => (<li key={d.id}>{d.name}: {d.amount}</li>))}
											</ul>
										)}
									</td>
									<td className="p-2 font-medium">{l.netPay}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			))}
		</div>
	)
}
