import { prisma } from './db'

export async function recordAuditLog(params: {
	action: string
	userId?: string
	entity?: string
	entityId?: string
	metadata?: unknown
}) {
	await prisma.auditLog.create({
		data: {
			action: params.action,
			userId: params.userId,
			entity: params.entity,
			entityId: params.entityId,
			metadata: params.metadata as any,
		},
	})
}

