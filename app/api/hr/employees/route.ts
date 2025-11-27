import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({ firstName: z.string(), lastName: z.string(), email: z.string().email().optional(), phone: z.string().optional() })
const updateSchema = z.object({ id: z.string(), firstName: z.string().optional(), lastName: z.string().optional(), email: z.string().email().optional(), phone: z.string().optional(), active: z.boolean().optional() })

export async function GET() {
  const data = await prisma.employee.findMany({ orderBy: { hireDate: 'desc' } })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const created = await prisma.employee.create({ data: parsed.data })
  return NextResponse.json(created, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const json = await req.json()
  const parsed = updateSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const { id, ...data } = parsed.data
  const updated = await prisma.employee.update({ where: { id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  await prisma.employee.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}



