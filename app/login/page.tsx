'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function LoginPage() {
  const { status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/quiz'

  // Redirect jika sudah login
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl)
    }
  }, [status, router, callbackUrl])

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-lime-400"></div>
      </div>
    )
  }

  // Jika sudah login, jangan render apapun
  if (status === 'authenticated') {
    return null
  }

  // Handle sign in with Google
  const handleGoogleLogin = () => {
    const url = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`
    window.location.href = url
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Sign in to continue</CardTitle>
          <p className="text-gray-400 text-sm mt-1">
            Only Google accounts are supported
          </p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600 flex items-center justify-center gap-3 py-6 text-base"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.25 1.19-1.08 2.19-2.28 2.75v3.06h3.62c2.1-1.95 3.3-4.72 3.3-7.8z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.08 0 5.65-1.03 7.45-2.86L12 16.65V23z"
              />
              <path
                fill="#FBBC05"
                d="M12 0C8.98 0 6.42 1.03 4.65 2.86l3.58 3.58C9.07 5.6 10.44 5 12 5c1.56 0 2.93.6 3.85 1.66L12 10.15V0z"
              />
              <path
                fill="#EA4335"
                d="M4.65 2.86C3.12 4.3 2 6.38 2 12h7.65v3.06H2c-.58 0-1.14.04-1.68.11v-3.23C.32 11.34 0 10.37 0 9.34 0 8.31.32 7.34.84 6.52v-3.23C.32 3.15 0 2.18 0 1.14 0 .67.08.25.24 0H2v3.06C3.12 1.03 4.65 0 6.42 0 7.98 0 9.35.6 10.27 1.66L12 0v12h7.65c-.25-1.19-1.08-2.19-2.28-2.75V12z"
              />
            </svg>
            Continue with Google
          </Button>
          <p className="text-center text-xs text-gray-500 mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}