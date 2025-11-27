import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({ title: z.string().min(1), supplierId: z.string().optional() })

export async function GET() {
	const data = await prisma.rFQ.findMany({ orderBy: { createdAt: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const json = await req.json()
	const parsed = createSchema.safeParse(json)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const created = await prisma.rFQ.create({ data: parsed.data })
	return NextResponse.json(created, { status: 201 })
}

