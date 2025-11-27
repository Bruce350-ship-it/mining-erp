import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const runSchema = z.object({
	periodFrom: z.string(),
	periodTo: z.string(),
})

export async function GET() {
	const data = await prisma.payrollRun.findMany({ include: { lines: { include: { allowanceItems: true, deductionItems: true } } }, orderBy: { createdAt: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const body = await req.json()
	const parsed = runSchema.safeParse(body)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const { periodFrom, periodTo } = parsed.data

	const employees = await prisma.employee.findMany({ where: { active: true } })
	const created = await prisma.$transaction(async (tx) => {
		const run = await tx.payrollRun.create({ data: { periodFrom: new Date(periodFrom), periodTo: new Date(periodTo) } })
		for (const emp of employees) {
			const basic = 1000
			const allowances = 200
			const deductions = 100
			const line = await tx.payrollLine.create({
				data: {
					payrollRunId: run.id,
					employeeId: emp.id,
					basicPay: basic,
					allowances,
					deductions,
					netPay: basic + allowances - deductions,
				},
			})
			await tx.allowance.create({ data: { payrollLineId: line.id, name: 'Housing', amount: 150 } })
			await tx.allowance.create({ data: { payrollLineId: line.id, name: 'Transport', amount: 50 } })
			await tx.deduction.create({ data: { payrollLineId: line.id, name: 'Tax', amount: 80 } })
			await tx.deduction.create({ data: { payrollLineId: line.id, name: 'Pension', amount: 20 } })
		}
		return run
	})
	const withLines = await prisma.payrollRun.findUnique({ where: { id: created.id }, include: { lines: { include: { allowanceItems: true, deductionItems: true } } } })
	return NextResponse.json(withLines, { status: 201 })
}
