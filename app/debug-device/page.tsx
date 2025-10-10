'use client'

import { useState, useEffect } from 'react'
import { getDeviceToken, clearDeviceToken } from '@/lib/device-fingerprint'

export default function DebugDevicePage() {
  const [deviceToken, setDeviceToken] = useState<string>('')
  const [localStorageToken, setLocalStorageToken] = useState<string | null>(null)

  useEffect(() => {
    loadToken()
  }, [])

  const loadToken = async () => {
    const token = await getDeviceToken()
    setDeviceToken(token)
    setLocalStorageToken(localStorage.getItem('device_token'))
  }

  const handleClearToken = () => {
    clearDeviceToken()
    loadToken()
  }

  const handleGenerateNew = async () => {
    clearDeviceToken()
    const newToken = await getDeviceToken()
    setDeviceToken(newToken)
    setLocalStorageToken(localStorage.getItem('device_token'))
  }

  return (
    <div className="min-h-screen bg-[#f5f5fa] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug Device Token</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Device Token Info</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Device Token (from getDeviceToken()):
              </label>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all">
                {deviceToken || 'Loading...'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LocalStorage Value:
              </label>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all">
                {localStorageToken || 'Not set'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Are they the same?
              </label>
              <div className={`p-3 rounded font-semibold ${
                deviceToken === localStorageToken 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {deviceToken === localStorageToken ? '✅ YES - Consistent' : '❌ NO - Inconsistent!'}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={loadToken}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              🔄 Reload
            </button>
            <button
              onClick={handleGenerateNew}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              🆕 Generate New
            </button>
            <button
              onClick={handleClearToken}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              🗑️ Clear Token
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Browser Info</h2>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">User Agent:</span>
              <div className="bg-gray-100 p-2 rounded mt-1 break-all">
                {navigator.userAgent}
              </div>
            </div>
            <div>
              <span className="font-semibold">Platform:</span> {navigator.platform}
            </div>
            <div>
              <span className="font-semibold">Language:</span> {navigator.language}
            </div>
            <div>
              <span className="font-semibold">Screen:</span> {screen.width} x {screen.height}
            </div>
            <div>
              <span className="font-semibold">Timezone:</span> {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">ℹ️ Instructions</h3>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Mở DevTools Console (F12) để xem logs</li>
            <li>Copy device token ở trên</li>
            <li>Đăng nhập và check console logs</li>
            <li>So sánh device token trong console với token ở trên</li>
            <li>Check database xem token nào được lưu</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
