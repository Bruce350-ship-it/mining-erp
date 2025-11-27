"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Sidebar from './Sidebar'
import { SessionProvider, useSession } from 'next-auth/react'
import { ToastProvider } from './Toast'

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
	const { data: session, status } = useSession()
	const pathname = usePathname()
	const [sidebarOpen, setSidebarOpen] = useState(true)

	// Check if we're on an auth page
	const isAuthPage = pathname?.startsWith('/auth')

	// During loading, don't show header/sidebar
	if (status === 'loading') {
		return <ToastProvider>{children}</ToastProvider>
	}

	// Don't show header/sidebar on auth pages or if not authenticated
	if (isAuthPage || !session) {
		return <ToastProvider>{children}</ToastProvider>
	}

	// Handler for toggling sidebar
	const handleMenuClick = () => {
		setSidebarOpen(prev => !prev)
	}

	// Show header and sidebar only when authenticated and not on auth pages
	return (
		<div className="min-h-screen flex flex-col">
			<Header onMenuClick={handleMenuClick} />
			<div className="flex flex-1 overflow-hidden relative">
				<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				<main className="flex-1 min-w-0 overflow-auto">
					<ToastProvider>{children}</ToastProvider>
				</main>
			</div>
		</div>
	)
}

export default function LayoutClient({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SessionProvider>
			<AuthenticatedLayout>{children}</AuthenticatedLayout>
		</SessionProvider>
	)
}

