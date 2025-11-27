import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({ siteId: z.string().optional(), type: z.string(), value: z.number(), unit: z.string(), takenAt: z.string().optional() })

export async function GET() {
	const data = await prisma.environmentalReading.findMany({ orderBy: { takenAt: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const body = await req.json()
	const parsed = schema.safeParse(body)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const created = await prisma.environmentalReading.create({
		data: { ...parsed.data, takenAt: parsed.data.takenAt ? new Date(parsed.data.takenAt) : undefined },
	})
	return NextResponse.json(created, { status: 201 })
}

