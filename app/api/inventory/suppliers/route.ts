import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({ name: z.string().min(1), email: z.string().email().optional(), phone: z.string().optional() })
const updateSchema = z.object({ id: z.string(), name: z.string().optional(), email: z.string().email().optional(), phone: z.string().optional() })

export async function GET() {
  const data = await prisma.supplier.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const created = await prisma.supplier.create({ data: parsed.data })
  return NextResponse.json(created, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const json = await req.json()
  const parsed = updateSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const { id, ...data } = parsed.data
  const updated = await prisma.supplier.update({ where: { id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  await prisma.supplier.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}



