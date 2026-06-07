import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [verified, setVerified] = useState(searchParams.get('verified') === 'true')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        {verified ? (
          <>
            <div className="text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
            <p className="text-gray-600 mb-6">Your email has been successfully verified.</p>
            <Link
              to="/login"
              className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">✗</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-600 mb-6">The verification link is invalid or has expired.</p>
            <Link
              to="/login"
              className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
