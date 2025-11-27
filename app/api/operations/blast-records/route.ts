import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({ pitId: z.string(), explosivesKg: z.number().positive(), notes: z.string().optional(), date: z.string().optional() })

export async function GET() {
	const data = await prisma.blastRecord.findMany({ orderBy: { date: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const body = await req.json()
	const parsed = schema.safeParse(body)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const created = await prisma.blastRecord.create({ data: { ...parsed.data, date: parsed.data.date ? new Date(parsed.data.date) : undefined } })
	return NextResponse.json(created, { status: 201 })
}

