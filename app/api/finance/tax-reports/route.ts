import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({ periodFrom: z.string(), periodTo: z.string(), amount: z.number().nonnegative() })

export async function GET() {
	const data = await prisma.taxReport.findMany({ orderBy: { createdAt: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const body = await req.json()
	const parsed = schema.safeParse(body)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const created = await prisma.taxReport.create({ data: { periodFrom: new Date(parsed.data.periodFrom), periodTo: new Date(parsed.data.periodTo), amount: parsed.data.amount } })
	return NextResponse.json(created, { status: 201 })
}

