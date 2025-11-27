import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({
	employeeId: z.string(),
	checkIn: z.string(),
	checkOut: z.string().optional(),
})

export async function GET() {
	const data = await prisma.attendanceLog.findMany({ orderBy: { checkIn: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const body = await req.json()
	const parsed = createSchema.safeParse(body)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const { employeeId, checkIn, checkOut } = parsed.data
	const created = await prisma.attendanceLog.create({
		data: { employeeId, checkIn: new Date(checkIn), checkOut: checkOut ? new Date(checkOut) : null },
	})
	return NextResponse.json(created, { status: 201 })
}

