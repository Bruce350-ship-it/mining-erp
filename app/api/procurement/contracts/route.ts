import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({ tenderId: z.string().optional(), supplierId: z.string().optional(), startDate: z.string().optional(), endDate: z.string().optional(), value: z.number().optional() })

export async function GET() {
	const data = await prisma.contract.findMany({ orderBy: { createdAt: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const json = await req.json()
	const parsed = createSchema.safeParse(json)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const created = await prisma.contract.create({ data: { ...parsed.data, startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined, endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined } })
	return NextResponse.json(created, { status: 201 })
}

