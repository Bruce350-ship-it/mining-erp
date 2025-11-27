import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({ employeeId: z.string(), name: z.string(), issuedAt: z.string().optional(), expiresAt: z.string().optional() })
const updateSchema = z.object({ id: z.string(), name: z.string().optional(), issuedAt: z.string().optional(), expiresAt: z.string().optional() })

export async function GET() {
  const data = await prisma.certification.findMany({ orderBy: { issuedAt: 'desc' } })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const created = await prisma.certification.create({ data: { ...parsed.data, issuedAt: parsed.data.issuedAt ? new Date(parsed.data.issuedAt) : undefined, expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined } })
  return NextResponse.json(created, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const json = await req.json()
  const parsed = updateSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const { id, ...rest } = parsed.data
  const updated = await prisma.certification.update({ where: { id }, data: { ...rest, issuedAt: rest.issuedAt ? new Date(rest.issuedAt) : undefined, expiresAt: rest.expiresAt ? new Date(rest.expiresAt) : undefined } })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  await prisma.certification.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}



