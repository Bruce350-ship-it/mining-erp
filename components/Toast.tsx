"use client"

import { createContext, useCallback, useContext, useState } from 'react'

type Toast = { id: number; message: string; type: 'success' | 'error' }

const ToastCtx = createContext<{ notify: (msg: string, type?: 'success' | 'error') => void } | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const notify = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2500)
  }, [])

  return (
    <ToastCtx.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded px-3 py-2 text-white shadow ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{t.message}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}



