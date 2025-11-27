import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({
	date: z.string().optional(),
	sourcePitId: z.string().optional(),
	destination: z.string(),
	materialType: z.string(),
	tons: z.number().positive(),
})

export async function GET() {
	const data = await prisma.materialMovement.findMany({ orderBy: { date: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const body = await req.json()
	const parsed = createSchema.safeParse(body)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const created = await prisma.materialMovement.create({
		data: {
			...parsed.data,
			date: parsed.data.date ? new Date(parsed.data.date) : undefined,
		},
	})
	return NextResponse.json(created, { status: 201 })
}

export async function PATCH(req: NextRequest) {
	const { id, approved } = await req.json()
	if (!id || typeof approved !== 'boolean') {
		return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	}
	const updated = await prisma.materialMovement.update({ where: { id }, data: { approved } })
	return NextResponse.json(updated)
}

