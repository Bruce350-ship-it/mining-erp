import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({ costCenterId: z.string().optional(), date: z.string().optional(), amount: z.number().positive(), description: z.string().optional() })

export async function GET() {
  const data = await prisma.expense.findMany({ orderBy: { date: 'desc' } })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const created = await prisma.expense.create({ data: { ...parsed.data, date: parsed.data.date ? new Date(parsed.data.date) : undefined } })
  return NextResponse.json(created, { status: 201 })
}



