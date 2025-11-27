import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({ code: z.string().min(1), name: z.string().min(1) })
const updateSchema = z.object({ id: z.string(), code: z.string().optional(), name: z.string().optional() })

export async function GET() {
  const data = await prisma.costCenter.findMany({ orderBy: { code: 'asc' } })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const created = await prisma.costCenter.create({ data: parsed.data })
  return NextResponse.json(created, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const json = await req.json()
  const parsed = updateSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const { id, ...data } = parsed.data
  const updated = await prisma.costCenter.update({ where: { id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  await prisma.costCenter.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}



