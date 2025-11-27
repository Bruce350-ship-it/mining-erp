import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
	const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
	const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'

	const permissions = [
		'core.*',
		'operations.view',
		'operations.edit',
		'maintenance.view',
		'maintenance.edit',
		'inventory.view',
		'inventory.edit',
		'procurement.view',
		'procurement.edit',
		'hr.view',
		'hr.edit',
		'finance.view',
		'finance.edit',
		'environment.view',
		'environment.edit',
	]

	// Upsert permissions
	await Promise.all(
		permissions.map((key) =>
			prisma.permission.upsert({
				where: { key },
				update: {},
				create: { key },
			})
		)
	)

	// Create Admin role with all permissions
	const adminRole = await prisma.role.upsert({
		where: { name: 'Admin' },
		update: {},
		create: { name: 'Admin' },
	})

	const allPerms = await prisma.permission.findMany()
	await prisma.$transaction(
		allPerms.map((p) =>
			prisma.rolePermission.upsert({
				where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } },
				update: {},
				create: { roleId: adminRole.id, permissionId: p.id },
			})
		)
	)

	// Create Company
	const company = await prisma.company.upsert({
		where: { id: 'seed-company' },
		update: {},
		create: { id: 'seed-company', name: 'Seed Company' },
	})

	// Create Admin user
	const hash = await bcrypt.hash(adminPassword, 10)
	const adminUser = await prisma.user.upsert({
		where: { email: adminEmail },
		update: {},
		create: {
			email: adminEmail,
			passwordHash: hash,
			firstName: 'System',
			lastName: 'Admin',
			companyId: company.id,
		},
	})

	await prisma.userRole.upsert({
		where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
		update: {},
		create: { userId: adminUser.id, roleId: adminRole.id },
	})

	console.log('Seed completed')
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
