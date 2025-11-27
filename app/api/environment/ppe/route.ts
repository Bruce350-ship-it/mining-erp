import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({ employeeId: z.string(), item: z.string(), quantity: z.number().int().positive(), issuedAt: z.string().optional() })

export async function GET() {
  const data = await prisma.pPEIssued.findMany({ orderBy: { issuedAt: 'desc' } })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const created = await prisma.pPEIssued.create({ data: { ...parsed.data, issuedAt: parsed.data.issuedAt ? new Date(parsed.data.issuedAt) : undefined } })
  return NextResponse.json(created, { status: 201 })
}



