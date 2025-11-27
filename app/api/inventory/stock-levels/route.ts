import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const data = await prisma.stockLevel.findMany({ include: { warehouse: true, inventoryItem: true }, orderBy: { updatedAt: 'desc' } })
  return NextResponse.json(data)
}



