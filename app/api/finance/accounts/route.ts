import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({ code: z.string(), name: z.string(), type: z.string() })

export async function GET() {
	const data = await prisma.gLAccount.findMany({ orderBy: { code: 'asc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const json = await req.json()
	const parsed = schema.safeParse(json)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const created = await prisma.gLAccount.create({ data: parsed.data })
	return NextResponse.json(created, { status: 201 })
}

