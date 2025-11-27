import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({ employeeId: z.string(), action: z.enum(['checkin','checkout']) })

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = schema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const { employeeId, action } = parsed.data
  if (action === 'checkin') {
    const created = await prisma.attendanceLog.create({ data: { employeeId, checkIn: new Date() } })
    return NextResponse.json(created, { status: 201 })
  } else {
    const open = await prisma.attendanceLog.findFirst({ where: { employeeId, checkOut: null }, orderBy: { checkIn: 'desc' } })
    if (!open) return NextResponse.json({ error: 'No open attendance' }, { status: 400 })
    const updated = await prisma.attendanceLog.update({ where: { id: open.id }, data: { checkOut: new Date() } })
    return NextResponse.json(updated)
  }
}



