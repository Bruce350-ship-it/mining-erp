import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting comprehensive seed...')

    // =========================================
    // 1. CORE & AUTH
    // =========================================
    console.log('📦 Seeding core & auth...')

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'

    // Permissions
    const permissions = [
        'core.*',
        'operations.view', 'operations.edit',
        'maintenance.view', 'maintenance.edit',
        'inventory.view', 'inventory.edit',
        'procurement.view', 'procurement.edit',
        'hr.view', 'hr.edit',
        'finance.view', 'finance.edit',
        'environment.view', 'environment.edit',
    ]

    await Promise.all(
        permissions.map((key) =>
            prisma.permission.upsert({
                where: { key },
                update: {},
                create: { key },
            })
        )
    )

    // Roles
    const adminRole = await prisma.role.upsert({
        where: { name: 'Admin' },
        update: {},
        create: { name: 'Admin', description: 'Full system access' },
    })

    const managerRole = await prisma.role.upsert({
        where: { name: 'Manager' },
        update: {},
        create: { name: 'Manager', description: 'Departmental management access' },
    })

    const operatorRole = await prisma.role.upsert({
        where: { name: 'Operator' },
        update: {},
        create: { name: 'Operator', description: 'Operational view and limited edit' },
    })

    // Assign all permissions to Admin
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

    // Company & Sites
    const company = await prisma.company.upsert({
        where: { id: 'seed-company' },
        update: {},
        create: { id: 'seed-company', name: 'Golden Valley Mining Co.' },
    })

    const site1 = await prisma.site.upsert({
        where: { id: 'site-north' },
        update: {},
        create: { id: 'site-north', name: 'North Valley Site', companyId: company.id },
    })

    const site2 = await prisma.site.upsert({
        where: { id: 'site-south' },
        update: {},
        create: { id: 'site-south', name: 'South Ridge Site', companyId: company.id },
    })

    // Departments
    const deptOps = await prisma.department.upsert({
        where: { id: 'dept-operations' },
        update: {},
        create: { id: 'dept-operations', name: 'Operations', companyId: company.id },
    })

    const deptMaint = await prisma.department.upsert({
        where: { id: 'dept-maintenance' },
        update: {},
        create: { id: 'dept-maintenance', name: 'Maintenance', companyId: company.id },
    })

    const deptHR = await prisma.department.upsert({
        where: { id: 'dept-hr' },
        update: {},
        create: { id: 'dept-hr', name: 'Human Resources', companyId: company.id },
    })

    // Users
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

    const managerUser = await prisma.user.upsert({
        where: { email: 'manager@example.com' },
        update: {},
        create: {
            email: 'manager@example.com',
            passwordHash: await bcrypt.hash('Manager123!', 10),
            firstName: 'Operations',
            lastName: 'Manager',
            companyId: company.id,
        },
    })

    const operatorUser = await prisma.user.upsert({
        where: { email: 'operator@example.com' },
        update: {},
        create: {
            email: 'operator@example.com',
            passwordHash: await bcrypt.hash('Operator123!', 10),
            firstName: 'Field',
            lastName: 'Operator',
            companyId: company.id,
        },
    })

    // User Roles
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
        update: {},
        create: { userId: adminUser.id, roleId: adminRole.id },
    })
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: managerUser.id, roleId: managerRole.id } },
        update: {},
        create: { userId: managerUser.id, roleId: managerRole.id },
    })
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: operatorUser.id, roleId: operatorRole.id } },
        update: {},
        create: { userId: operatorUser.id, roleId: operatorRole.id },
    })

    // =========================================
    // 2. MINING OPERATIONS
    // =========================================
    console.log('⛏️  Seeding mining operations...')

    // Shifts
    const dayShift = await prisma.shift.upsert({
        where: { id: 'shift-day' },
        update: {},
        create: {
            id: 'shift-day',
            name: 'Day Shift',
            startTime: new Date('2024-01-01T07:00:00Z'),
            endTime: new Date('2024-01-01T15:00:00Z'),
        },
    })

    const nightShift = await prisma.shift.upsert({
        where: { id: 'shift-night' },
        update: {},
        create: {
            id: 'shift-night',
            name: 'Night Shift',
            startTime: new Date('2024-01-01T19:00:00Z'),
            endTime: new Date('2024-01-02T03:00:00Z'),
        },
    })

    // Mines & Pits
    const mine1 = await prisma.mine.upsert({
        where: { id: 'mine-golden-valley' },
        update: {},
        create: { id: 'mine-golden-valley', name: 'Golden Valley Mine' },
    })

    const mine2 = await prisma.mine.upsert({
        where: { id: 'mine-silver-ridge' },
        update: {},
        create: { id: 'mine-silver-ridge', name: 'Silver Ridge Mine' },
    })

    const pit1 = await prisma.pit.upsert({
        where: { id: 'pit-alpha' },
        update: {},
        create: { id: 'pit-alpha', name: 'Pit Alpha', mineId: mine1.id },
    })

    const pit2 = await prisma.pit.upsert({
        where: { id: 'pit-beta' },
        update: {},
        create: { id: 'pit-beta', name: 'Pit Beta', mineId: mine1.id },
    })

    const pit3 = await prisma.pit.upsert({
        where: { id: 'pit-gamma' },
        update: {},
        create: { id: 'pit-gamma', name: 'Pit Gamma', mineId: mine2.id },
    })

    // Equipment
    const equipmentData = [
        { code: 'EX-001', name: 'Excavator XL-500', type: 'Excavator', lat: -15.4167, lng: 28.2833 },
        { code: 'EX-002', name: 'Excavator XL-501', type: 'Excavator', lat: -15.4170, lng: 28.2840 },
        { code: 'DT-001', name: 'Dump Truck DT-100', type: 'Dump Truck', lat: -15.4180, lng: 28.2850 },
        { code: 'DT-002', name: 'Dump Truck DT-101', type: 'Dump Truck', lat: -15.4185, lng: 28.2855 },
        { code: 'DT-003', name: 'Dump Truck DT-102', type: 'Dump Truck', lat: -15.4190, lng: 28.2860 },
        { code: 'DR-001', name: 'Drill Rig DR-50', type: 'Drill', lat: -15.4200, lng: 28.2870 },
        { code: 'LD-001', name: 'Loader LD-200', type: 'Loader', lat: -15.4210, lng: 28.2880 },
        { code: 'BL-001', name: 'Bulldozer BD-75', type: 'Bulldozer', lat: -15.4220, lng: 28.2890 },
    ]

    for (const eq of equipmentData) {
        await prisma.equipment.upsert({
            where: { code: eq.code },
            update: {},
            create: {
                code: eq.code,
                name: eq.name,
                type: eq.type,
                status: 'available',
                latitude: eq.lat,
                longitude: eq.lng,
                lastKnownAt: new Date(),
            },
        })
    }

    // Drill Logs
    await prisma.drillLog.create({
        data: { pitId: pit1.id, meters: 125.5, notes: 'Good rock quality' },
    })
    await prisma.drillLog.create({
        data: { pitId: pit1.id, meters: 98.3, notes: 'Some fractures detected' },
    })
    await prisma.drillLog.create({
        data: { pitId: pit2.id, meters: 110.0 },
    })

    // Material Movements
    await prisma.materialMovement.create({
        data: {
            sourcePitId: pit1.id,
            destination: 'Processing Plant A',
            materialType: 'Gold Ore',
            tons: 2500,
            approved: true,
        },
    })
    await prisma.materialMovement.create({
        data: {
            sourcePitId: pit2.id,
            destination: 'Processing Plant B',
            materialType: 'Copper Ore',
            tons: 1800,
            approved: false,
        },
    })

    // Ore Grades
    await prisma.oreGrade.create({
        data: { pitId: pit1.id, gradeAu: 2.5, gradeCu: 0.8, gradeFe: 12.3 },
    })
    await prisma.oreGrade.create({
        data: { pitId: pit2.id, gradeAu: 1.9, gradeCu: 1.2, gradeFe: 15.7 },
    })
    await prisma.oreGrade.create({
        data: { pitId: pit3.id, gradeAu: 3.1, gradeCu: 0.5, gradeFe: 10.2 },
    })

    // =========================================
    // 3. MAINTENANCE
    // =========================================
    console.log('🔧 Seeding maintenance...')

    // Assets
    const assetData = [
        { code: 'AST-EX-001', name: 'Excavator XL-500', category: 'Heavy Equipment' },
        { code: 'AST-DT-001', name: 'Dump Truck DT-100', category: 'Transport' },
        { code: 'AST-DR-001', name: 'Drill Rig DR-50', category: 'Drilling' },
        { code: 'AST-GEN-001', name: 'Generator 500kW', category: 'Power' },
        { code: 'AST-PUMP-001', name: 'Water Pump WP-100', category: 'Water Systems' },
    ]

    const assets = []
    for (const ast of assetData) {
        const asset = await prisma.asset.upsert({
            where: { code: ast.code },
            update: {},
            create: { code: ast.code, name: ast.name, category: ast.category, status: 'active' },
        })
        assets.push(asset)
    }

    // Maintenance Schedules
    await prisma.maintenanceSchedule.create({
        data: {
            assetId: assets[0].id,
            frequency: 'weekly',
            nextDueDate: new Date('2024-12-01'),
        },
    })
    await prisma.maintenanceSchedule.create({
        data: {
            assetId: assets[1].id,
            frequency: 'monthly',
            nextDueDate: new Date('2024-12-15'),
        },
    })

    // Work Orders
    const wo1 = await prisma.workOrder.create({
        data: {
            assetId: assets[0].id,
            title: 'Oil change and filter replacement',
            description: 'Routine maintenance - 500 hour service',
            status: 'open',
        },
    })
    await prisma.workOrder.create({
        data: {
            assetId: assets[1].id,
            title: 'Tire inspection and rotation',
            status: 'in-progress',
        },
    })
    await prisma.workOrder.create({
        data: {
            assetId: assets[2].id,
            title: 'Hydraulic system repair',
            description: 'Hydraulic leak detected',
            status: 'completed',
            completedAt: new Date('2024-11-20'),
        },
    })

    // Fuel Logs
    await prisma.fuelLog.create({
        data: { assetId: assets[0].id, liters: 450 },
    })
    await prisma.fuelLog.create({
        data: { assetId: assets[1].id, liters: 380 },
    })
    await prisma.fuelLog.create({
        data: { assetId: assets[2].id, liters: 220 },
    })

    // =========================================
    // 4. INVENTORY & PROCUREMENT
    // =========================================
    console.log('📦 Seeding inventory & procurement...')

    // Suppliers
    const supplier1 = await prisma.supplier.upsert({
        where: { id: 'supplier-acme' },
        update: {},
        create: {
            id: 'supplier-acme',
            name: 'Acme Mining Supplies',
            email: 'sales@acmemining.com',
            phone: '+260-555-0101',
        },
    })

    const supplier2 = await prisma.supplier.upsert({
        where: { id: 'supplier-global' },
        update: {},
        create: {
            id: 'supplier-global',
            name: 'Global Equipment Ltd',
            email: 'info@globalequip.com',
            phone: '+260-555-0202',
        },
    })

    const supplier3 = await prisma.supplier.upsert({
        where: { id: 'supplier-local' },
        update: {},
        create: {
            id: 'supplier-local',
            name: 'Local Parts Co.',
            email: 'contact@localparts.zm',
            phone: '+260-555-0303',
        },
    })

    // Warehouses
    const wh1 = await prisma.warehouse.upsert({
        where: { id: 'wh-main' },
        update: {},
        create: { id: 'wh-main', name: 'Main Warehouse', location: 'North Valley Site' },
    })

    const wh2 = await prisma.warehouse.upsert({
        where: { id: 'wh-south' },
        update: {},
        create: { id: 'wh-south', name: 'South Warehouse', location: 'South Ridge Site' },
    })

    // Inventory Items
    const itemsData = [
        { sku: 'PART-001', name: 'Hydraulic Oil 20L', uom: 'Liter' },
        { sku: 'PART-002', name: 'Air Filter - Heavy Duty', uom: 'Unit' },
        { sku: 'PART-003', name: 'Excavator Bucket Teeth', uom: 'Unit' },
        { sku: 'PART-004', name: 'Fuel Filter', uom: 'Unit' },
        { sku: 'PART-005', name: 'Drill Bits 150mm', uom: 'Unit' },
        { sku: 'PART-006', name: 'Conveyor Belt Sections', uom: 'Meter' },
        { sku: 'CHEM-001', name: 'Cyanide Solution', uom: 'Liter' },
        { sku: 'PPE-001', name: 'Safety Helmet', uom: 'Unit' },
        { sku: 'PPE-002', name: 'Safety Boots', uom: 'Pair' },
        { sku: 'PPE-003', name: 'High-Vis Vest', uom: 'Unit' },
    ]

    const items = []
    for (const item of itemsData) {
        const inv = await prisma.inventoryItem.upsert({
            where: { sku: item.sku },
            update: {},
            create: { sku: item.sku, name: item.name, uom: item.uom },
        })
        items.push(inv)
    }

    // Stock Levels
    await prisma.stockLevel.upsert({
        where: { warehouseId_inventoryItemId: { warehouseId: wh1.id, inventoryItemId: items[0].id } },
        update: {},
        create: { warehouseId: wh1.id, inventoryItemId: items[0].id, quantity: 500 },
    })
    await prisma.stockLevel.upsert({
        where: { warehouseId_inventoryItemId: { warehouseId: wh1.id, inventoryItemId: items[1].id } },
        update: {},
        create: { warehouseId: wh1.id, inventoryItemId: items[1].id, quantity: 150 },
    })
    await prisma.stockLevel.upsert({
        where: { warehouseId_inventoryItemId: { warehouseId: wh1.id, inventoryItemId: items[2].id } },
        update: {},
        create: { warehouseId: wh1.id, inventoryItemId: items[2].id, quantity: 75 },
    })
    await prisma.stockLevel.upsert({
        where: { warehouseId_inventoryItemId: { warehouseId: wh2.id, inventoryItemId: items[7].id } },
        update: {},
        create: { warehouseId: wh2.id, inventoryItemId: items[7].id, quantity: 200 },
    })
    await prisma.stockLevel.upsert({
        where: { warehouseId_inventoryItemId: { warehouseId: wh2.id, inventoryItemId: items[8].id } },
        update: {},
        create: { warehouseId: wh2.id, inventoryItemId: items[8].id, quantity: 120 },
    })

    // Purchase Orders
    const po1 = await prisma.purchaseOrder.create({
        data: { supplierId: supplier1.id, status: 'open' },
    })
    const po2 = await prisma.purchaseOrder.create({
        data: { supplierId: supplier2.id, status: 'closed' },
    })

    // Receipts
    await prisma.receipt.create({
        data: {
            purchaseOrderId: po2.id,
            warehouseId: wh1.id,
            inventoryItemId: items[0].id,
            quantity: 200,
        },
    })
    await prisma.receipt.create({
        data: {
            purchaseOrderId: po2.id,
            warehouseId: wh1.id,
            inventoryItemId: items[1].id,
            quantity: 50,
        },
    })

    // =========================================
    // 5. HR & PAYROLL
    // =========================================
    console.log('👥 Seeding HR & payroll...')

    // Employees
    const employeesData = [
        { firstName: 'John', lastName: 'Mwansa', email: 'john.mwansa@mining.zm', phone: '+260-97-1234567' },
        { firstName: 'Sarah', lastName: 'Banda', email: 'sarah.banda@mining.zm', phone: '+260-97-2345678' },
        { firstName: 'Peter', lastName: 'Phiri', email: 'peter.phiri@mining.zm', phone: '+260-97-3456789' },
        { firstName: 'Grace', lastName: 'Tembo', email: 'grace.tembo@mining.zm', phone: '+260-97-4567890' },
        { firstName: 'David', lastName: 'Zulu', email: 'david.zulu@mining.zm', phone: '+260-97-5678901' },
        { firstName: 'Mary', lastName: 'Sakala', email: 'mary.sakala@mining.zm', phone: '+260-97-6789012' },
        { firstName: 'James', lastName: 'Mumba', email: 'james.mumba@mining.zm', phone: '+260-97-7890123' },
        { firstName: 'Alice', lastName: 'Mulenga', email: 'alice.mulenga@mining.zm', phone: '+260-97-8901234' },
    ]

    const employees = []
    for (const emp of employeesData) {
        const employee = await prisma.employee.create({
            data: {
                firstName: emp.firstName,
                lastName: emp.lastName,
                email: emp.email,
                phone: emp.phone,
                hireDate: new Date('2023-01-15'),
                active: true,
            },
        })
        employees.push(employee)
    }

    // Certifications
    await prisma.certification.create({
        data: {
            employeeId: employees[0].id,
            name: 'Heavy Equipment Operator License',
            issuedAt: new Date('2023-03-01'),
            expiresAt: new Date('2026-03-01'),
        },
    })
    await prisma.certification.create({
        data: {
            employeeId: employees[1].id,
            name: 'First Aid Certificate',
            issuedAt: new Date('2023-06-15'),
            expiresAt: new Date('2025-06-15'),
        },
    })
    await prisma.certification.create({
        data: {
            employeeId: employees[2].id,
            name: 'Blasting License',
            issuedAt: new Date('2022-09-01'),
            expiresAt: new Date('2025-09-01'),
        },
    })

    // Attendance Logs
    await prisma.attendanceLog.create({
        data: {
            employeeId: employees[0].id,
            checkIn: new Date('2024-11-24T07:00:00Z'),
            checkOut: new Date('2024-11-24T15:30:00Z'),
        },
    })
    await prisma.attendanceLog.create({
        data: {
            employeeId: employees[1].id,
            checkIn: new Date('2024-11-24T07:05:00Z'),
            checkOut: new Date('2024-11-24T15:20:00Z'),
        },
    })
    await prisma.attendanceLog.create({
        data: {
            employeeId: employees[2].id,
            checkIn: new Date('2024-11-24T19:00:00Z'),
            // Still checked in (no checkout)
        },
    })

    // =========================================
    // 6. FINANCE
    // =========================================
    console.log('💰 Seeding finance...')

    // GL Accounts
    const accountsData = [
        { code: '1000', name: 'Cash', type: 'asset' },
        { code: '1200', name: 'Accounts Receivable', type: 'asset' },
        { code: '1500', name: 'Inventory', type: 'asset' },
        { code: '2000', name: 'Accounts Payable', type: 'liability' },
        { code: '3000', name: 'Share Capital', type: 'equity' },
        { code: '4000', name: 'Sales Revenue', type: 'income' },
        { code: '5000', name: 'Cost of Sales', type: 'expense' },
        { code: '6000', name: 'Operating Expenses', type: 'expense' },
    ]

    const accounts = []
    for (const acc of accountsData) {
        const account = await prisma.gLAccount.upsert({
            where: { code: acc.code },
            update: {},
            create: { code: acc.code, name: acc.name, type: acc.type, active: true },
        })
        accounts.push(account)
    }

    // Cost Centers
    const cc1 = await prisma.costCenter.upsert({
        where: { code: 'CC-OPS' },
        update: {},
        create: { code: 'CC-OPS', name: 'Operations' },
    })

    const cc2 = await prisma.costCenter.upsert({
        where: { code: 'CC-MAINT' },
        update: {},
        create: { code: 'CC-MAINT', name: 'Maintenance' },
    })

    const cc3 = await prisma.costCenter.upsert({
        where: { code: 'CC-ADMIN' },
        update: {},
        create: { code: 'CC-ADMIN', name: 'Administration' },
    })

    // =========================================
    // 7. ENVIRONMENT & SAFETY
    // =========================================
    console.log('🌍 Seeding environment & safety...')

    // Safety Inspections
    await prisma.inspection.create({
        data: {
            type: 'Safety Walkthrough',
            findings: 'All safety equipment in good condition',
            passed: true,
        },
    })
    await prisma.inspection.create({
        data: {
            type: 'Equipment Inspection',
            findings: 'Minor issues found on excavator EX-002',
            passed: false,
        },
    })

    // PPE Issued
    await prisma.pPEIssued.create({
        data: {
            employeeId: employees[0].id,
            item: 'Safety Helmet',
            quantity: 1,
        },
    })
    await prisma.pPEIssued.create({
        data: {
            employeeId: employees[0].id,
            item: 'Safety Boots',
            quantity: 1,
        },
    })
    await prisma.pPEIssued.create({
        data: {
            employeeId: employees[1].id,
            item: 'High-Vis Vest',
            quantity: 2,
        },
    })

    console.log('✅ Comprehensive seed completed!')
    console.log('\n📊 Summary:')
    console.log('  - 3 Users (admin, manager, operator)')
    console.log('  - 3 Roles with permissions')
    console.log('  - 1 Company, 2 Sites, 3 Departments')
    console.log('  - 2 Mines, 3 Pits, 8 Equipment')
    console.log('  - 2 Shifts, operational logs, and ore grades')
    console.log('  - 5 Assets with maintenance schedules and work orders')
    console.log('  - 3 Suppliers, 2 Warehouses, 10 Inventory items')
    console.log('  - 8 Employees with certifications and attendance')
    console.log('  - 8 GL Accounts, 3 Cost Centers')
    console.log('  - Safety inspections and PPE issued')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
