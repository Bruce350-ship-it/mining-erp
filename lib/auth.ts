import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const credentialsSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

export const authOptions = {
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				const parsed = credentialsSchema.safeParse(credentials)
				if (!parsed.success) return null
				const { email, password } = parsed.data
				const user = await prisma.user.findUnique({ where: { email } })
				if (!user || !user.passwordHash) return null
				const valid = await bcrypt.compare(password, user.passwordHash)
				if (!valid || !user.isActive) return null
				return { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}` }
			},
		}),
	],
	session: { strategy: 'jwt' as const },
	callbacks: {
		async jwt({ token, user }: any) {
			if (user) token.userId = (user as any).id
			return token
		},
		async session({ session, token }: any) {
			;(session as any).userId = token.userId
			return session
		},
	},
	pages: {
		signIn: '/auth/sign-in',
	},
	secret: process.env.NEXTAUTH_SECRET,
} satisfies Parameters<typeof NextAuth>[0]
