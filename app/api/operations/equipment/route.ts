import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateSchema = z.object({
	id: z.string(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	lastKnownAt: z.string().optional(),
})

export async function GET() {
	const data = await prisma.equipment.findMany({ orderBy: { code: 'asc' } })
	return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
	const body = await req.json()
	const parsed = updateSchema.safeParse(body)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const { id, latitude, longitude, lastKnownAt } = parsed.data
	const updated = await prisma.equipment.update({
		where: { id },
		data: {
			latitude: latitude ?? null,
			longitude: longitude ?? null,
			lastKnownAt: lastKnownAt ? new Date(lastKnownAt) : null,
		},
	})
	return NextResponse.json(updated)
}

