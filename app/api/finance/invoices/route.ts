import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({ supplierId: z.string().optional(), date: z.string().optional(), amount: z.number().positive(), status: z.string().optional() })
const updateSchema = z.object({ id: z.string(), status: z.string().optional() })

export async function GET() {
  const data = await prisma.invoice.findMany({ orderBy: { date: 'desc' } })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const created = await prisma.invoice.create({ data: { ...parsed.data, date: parsed.data.date ? new Date(parsed.data.date) : undefined } })
  return NextResponse.json(created, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const json = await req.json()
  const parsed = updateSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const { id, ...data } = parsed.data
  const updated = await prisma.invoice.update({ where: { id }, data })
  return NextResponse.json(updated)
}



