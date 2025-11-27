"use client"

import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)
		const res = await signIn('credentials', {
			redirect: false,
			email,
			password,
		})
		setLoading(false)
		if (res?.error) {
			setError('Invalid credentials')
			return
		}
		router.push('/')
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<form onSubmit={onSubmit} className="shadow-lg border-[0.5px] border-gray-200 rounded-lg p-6 w-full max-w-sm space-y-4">
				<h1 className="text-2xl font-semibold">Sign in</h1>
				{error && <p className="text-sm text-red-600">{error}</p>}
				<div className="space-y-2">
					<label className="block text-sm">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full rounded input-shadow px-3 py-2 bg-white text-black"
						required
					/>
				</div>
				<div className="space-y-2">
					<label className="block text-sm">Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full rounded input-shadow px-3 py-2 bg-white text-black"
						required
					/>
				</div>
				<button
					type="submit"
					disabled={loading}
					className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
				>
					{loading ? 'Signing in…' : 'Sign in'}
				</button>
			</form>
		</div>
	)
}
