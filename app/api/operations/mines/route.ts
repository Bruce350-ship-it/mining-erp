import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const mineCreate = z.object({ name: z.string().min(1), siteId: z.string().optional() })
const mineUpdate = z.object({ id: z.string(), name: z.string().min(1).optional(), siteId: z.string().optional() })

export async function GET() {
	const data = await prisma.mine.findMany({ orderBy: { createdAt: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const json = await req.json()
	const parsed = mineCreate.safeParse(json)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const created = await prisma.mine.create({ data: parsed.data })
	return NextResponse.json(created, { status: 201 })
}

export async function PUT(req: NextRequest) {
	const json = await req.json()
	const parsed = mineUpdate.safeParse(json)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const { id, ...rest } = parsed.data
	const updated = await prisma.mine.update({ where: { id }, data: rest })
	return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const id = searchParams.get('id')
	if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
	await prisma.mine.delete({ where: { id } })
	return NextResponse.json({ ok: true })
}

