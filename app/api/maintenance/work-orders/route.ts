import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({ assetId: z.string(), title: z.string(), description: z.string().optional() })
const updateSchema = z.object({ id: z.string(), title: z.string().optional(), description: z.string().optional(), status: z.string().optional() })

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || undefined
  const data = await prisma.workOrder.findMany({ where: { status: status as any }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const created = await prisma.workOrder.create({ data: parsed.data })
  return NextResponse.json(created, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const json = await req.json()
  const parsed = updateSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const { id, ...rest } = parsed.data
  const updated = await prisma.workOrder.update({ where: { id }, data: rest })
  return NextResponse.json(updated)
}



