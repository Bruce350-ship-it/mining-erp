import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({ siteId: z.string().optional(), severity: z.string(), description: z.string().optional() })

export async function GET() {
	const data = await prisma.safetyIncident.findMany({ orderBy: { reportedAt: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const body = await req.json()
	const parsed = schema.safeParse(body)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const created = await prisma.safetyIncident.create({ data: parsed.data })
	return NextResponse.json(created, { status: 201 })
}

