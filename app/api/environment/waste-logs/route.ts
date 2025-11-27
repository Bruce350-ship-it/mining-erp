import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({ type: z.string(), quantity: z.number().nonnegative(), unit: z.string(), date: z.string().optional(), disposed: z.boolean().optional() })

export async function GET() {
  const data = await prisma.wasteLog.findMany({ orderBy: { date: 'desc' } })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const created = await prisma.wasteLog.create({ data: { ...parsed.data, date: parsed.data.date ? new Date(parsed.data.date) : undefined } })
  return NextResponse.json(created, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const { id, disposed } = await req.json()
  if (!id || typeof disposed !== 'boolean') return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const updated = await prisma.wasteLog.update({ where: { id }, data: { disposed } })
  return NextResponse.json(updated)
}



