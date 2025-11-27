import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({ supplierId: z.string() })
const updateSchema = z.object({ id: z.string(), status: z.string().optional() })

export async function GET() {
	const data = await prisma.purchaseOrder.findMany({ orderBy: { createdAt: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const json = await req.json()
	const parsed = createSchema.safeParse(json)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const created = await prisma.purchaseOrder.create({ data: parsed.data })
	return NextResponse.json(created, { status: 201 })
}

export async function PUT(req: NextRequest) {
	const json = await req.json()
	const parsed = updateSchema.safeParse(json)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const { id, ...data } = parsed.data
	const updated = await prisma.purchaseOrder.update({ where: { id }, data })
	return NextResponse.json(updated)
}

