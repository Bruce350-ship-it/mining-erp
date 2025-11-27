import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const lineSchema = z.object({ accountId: z.string(), costCenterId: z.string().optional(), debit: z.number().nonnegative(), credit: z.number().nonnegative() })
const entrySchema = z.object({ date: z.string().optional(), reference: z.string().optional(), lines: z.array(lineSchema).min(1) })

export async function GET() {
	const data = await prisma.journalEntry.findMany({ include: { lines: true }, orderBy: { date: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const body = await req.json()
	const parsed = entrySchema.safeParse(body)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const { date, reference, lines } = parsed.data
	const totalDebit = lines.reduce((s, l) => s + l.debit, 0)
	const totalCredit = lines.reduce((s, l) => s + l.credit, 0)
	if (Math.abs(totalDebit - totalCredit) > 1e-6) {
		return NextResponse.json({ error: 'Entry not balanced' }, { status: 400 })
	}
	const created = await prisma.journalEntry.create({
		data: {
			date: date ? new Date(date) : undefined,
			reference,
			lines: { create: lines.map((l) => ({ accountId: l.accountId, costCenterId: l.costCenterId, debit: l.debit, credit: l.credit })) },
		},
		include: { lines: true },
	})
	return NextResponse.json(created, { status: 201 })
}

