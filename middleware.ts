import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_PATHS = [
	'/auth/sign-in',
	'/api/auth',
]

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl

	// Allow public paths and static files
	const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
		pathname.startsWith('/_next') ||
		pathname.startsWith('/favicon') ||
		pathname.startsWith('/public')

	if (isPublic) return NextResponse.next()

	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
	if (!token) {
		const loginUrl = new URL('/auth/sign-in', req.url)
		loginUrl.searchParams.set('callbackUrl', pathname)
		return NextResponse.redirect(loginUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api/auth|_next|favicon|public).*)'],
}



