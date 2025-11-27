import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
	purchaseOrderId: z.string(),
	warehouseId: z.string(),
	inventoryItemId: z.string(),
	quantity: z.number().positive(),
})

export async function GET() {
	const data = await prisma.receipt.findMany({ orderBy: { receivedAt: 'desc' } })
	return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
	const json = await req.json()
	const parsed = schema.safeParse(json)
	if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
	const { purchaseOrderId, warehouseId, inventoryItemId, quantity } = parsed.data

	const result = await prisma.$transaction(async (tx) => {
		const receipt = await tx.receipt.create({
			data: { purchaseOrderId, warehouseId, inventoryItemId, quantity },
		})
		await tx.stockLevel.upsert({
			where: { warehouseId_inventoryItemId: { warehouseId, inventoryItemId } },
			create: { warehouseId, inventoryItemId, quantity },
			update: { quantity: { increment: quantity } },
		})
		return receipt
	})
	return NextResponse.json(result, { status: 201 })
}

