"use client"

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

interface HeaderProps {
	onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
	const { data: session } = useSession()
	const [searchQuery, setSearchQuery] = useState('')

	async function handleLogout() {
		await signOut({ callbackUrl: '/auth/sign-in' })
	}

	function handleSearch(e: React.FormEvent) {
		e.preventDefault()
		// TODO: Implement search functionality
		console.log('Search:', searchQuery)
	}

	return (
		<header className="h-16 shadow-md bg-white flex items-center px-4 gap-4 sticky top-0 z-50">
			{/* Hamburger Menu */}
			<button
				onClick={onMenuClick}
				className="p-2 hover:bg-gray-100 rounded"
				aria-label="Toggle sidebar"
			>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>

			{/* Logo */}
			<Link href="/" className="text-lg font-semibold text-gray-900 hover:text-gray-700">
				Mining ERP
			</Link>

			{/* Search Bar - Center */}
			<div className="flex-1 max-w-2xl mx-auto">
				<form onSubmit={handleSearch} className="relative">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search anything..."
						className="w-full rounded-lg input-shadow px-4 py-2 pl-10 pr-4 bg-white focus:outline-none focus:shadow-lg transition-shadow"
					/>
					<svg
						className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</form>
			</div>

			{/* Right Section: Settings, User, Logout */}
			<div className="flex items-center gap-4">
				{/* Settings Icon */}
				<button
					className="p-2 hover:bg-gray-100 rounded"
					aria-label="Settings"
					title="Settings"
				>
					<svg
						className="w-5 h-5 text-gray-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</button>

				{/* User Info */}
				<div className="flex items-center gap-2 text-sm">
					<div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-medium">
						{session?.user?.name?.charAt(0).toUpperCase() || session?.user?.email?.charAt(0).toUpperCase() || 'U'}
					</div>
					<span className="hidden sm:block text-gray-700">
						{session?.user?.name || session?.user?.email || 'User'}
					</span>
				</div>

				{/* Logout Icon */}
				<button
					onClick={handleLogout}
					className="p-2 hover:bg-gray-100 rounded"
					aria-label="Logout"
					title="Logout"
				>
					<svg
						className="w-5 h-5 text-gray-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
				</button>
			</div>
		</header>
	)
}

