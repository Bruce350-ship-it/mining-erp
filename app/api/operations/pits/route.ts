import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const pitCreate = z.object({ name: z.string().min(1), mineId: z.string() })
const pitUpdate = z.object({ id: z.string(), name: z.string().min(1).optional(), mineId: z.string().optional() })

export async function GET() {
	const data = await prisma.pit.findMany({ orderBy: { createdAt: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const json = await req.json()
	const parsed = pitCreate.safeParse(json)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const created = await prisma.pit.create({ data: parsed.data })
	return NextResponse.json(created, { status: 201 })
}

export async function PUT(req: NextRequest) {
	const json = await req.json()
	const parsed = pitUpdate.safeParse(json)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const { id, ...rest } = parsed.data
	const updated = await prisma.pit.update({ where: { id }, data: rest })
	return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const id = searchParams.get('id')
	if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
	await prisma.pit.delete({ where: { id } })
	return NextResponse.json({ ok: true })
}

