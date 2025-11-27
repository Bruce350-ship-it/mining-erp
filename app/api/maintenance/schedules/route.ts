import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({ assetId: z.string(), frequency: z.string(), nextDueDate: z.string() })
const updateSchema = z.object({ id: z.string(), frequency: z.string().optional(), nextDueDate: z.string().optional() })

export async function GET() {
	const data = await prisma.maintenanceSchedule.findMany({ orderBy: { nextDueDate: 'asc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const json = await req.json()
	const parsed = createSchema.safeParse(json)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const created = await prisma.maintenanceSchedule.create({ data: { ...parsed.data, nextDueDate: new Date(parsed.data.nextDueDate) } })
	return NextResponse.json(created, { status: 201 })
}

export async function PUT(req: NextRequest) {
	const json = await req.json()
	const parsed = updateSchema.safeParse(json)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const { id, ...rest } = parsed.data
	const updated = await prisma.maintenanceSchedule.update({ where: { id }, data: { ...rest, nextDueDate: rest.nextDueDate ? new Date(rest.nextDueDate) : undefined } })
	return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const id = searchParams.get('id')
	if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
	await prisma.maintenanceSchedule.delete({ where: { id } })
	return NextResponse.json({ ok: true })
}

