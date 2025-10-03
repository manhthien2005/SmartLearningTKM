'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  )
}

