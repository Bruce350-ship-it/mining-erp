import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking admin user...')
    console.log('NEXTAUTH_SECRET set:', !!process.env.NEXTAUTH_SECRET)
    console.log('NEXTAUTH_URL set:', !!process.env.NEXTAUTH_URL)
    if (process.env.NEXTAUTH_URL) console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)

    const email = 'admin@example.com'
    const password = 'ChangeMe123!'

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        console.log('User NOT found in database.')
        return
    }

    console.log('User found:', user.email)
    console.log('Is Active:', user.isActive)
    console.log('Stored Hash:', user.passwordHash)

    const valid = await bcrypt.compare(password, user.passwordHash)
    console.log('Password match:', valid)

    if (!valid) {
        console.log('Trying to hash the password again to see what it looks like...')
        const newHash = await bcrypt.hash(password, 10)
        console.log('New Hash would be:', newHash)
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
