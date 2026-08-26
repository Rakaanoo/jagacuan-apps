'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/lib/store'
import { LogIn, Loader2, AlertCircle, ShieldCheck } from 'lucide-react'

interface Props {
  title?: string
  description?: string
  redirectTo?: string
  onSuccess?: () => void
}

export default function GoogleSignInPrompt({
  title = 'Tautkan Akun Google',
  description = 'Fitur Ruang Nabung (Nabar) memerlukan akun Google untuk kolaborasi saldo realtime dan perlindungan data.',
  redirectTo,
  onSuccess,
}: Props) {
  const { theme } = useAppStore()
  const isDark = theme === 'dark'

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setErrorMessage(null)

    try {
      const supabase = createClient()
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const redirectUrl = redirectTo ? `${origin}${redirectTo}` : `${origin}/auth/callback`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) {
        setErrorMessage(error.message || 'Gagal menautkan akun Google. Silakan coba lagi.')
        setLoading(false)
      } else {
        if (onSuccess) onSuccess()
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan tidak terduga.')
      setLoading(false)
    }
  }

  const cardBg = isDark ? '#23242A' : '#FAF6EF'
  const cardBorder = isDark ? '#333644' : '#E0D5C3'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'
  const subText = isDark ? '#A0A5B5' : '#7A6F60'
  const badgeBg = isDark ? '#1C1D22' : '#EFEADF'

  return (
    <div
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: '24px',
        padding: '28px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '18px',
        maxWidth: '420px',
        margin: '0 auto',
        width: '100%',
        boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          backgroundColor: isDark ? '#2D303E' : '#EAE3D5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isDark ? 'inset 0 1px 1px rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <LogIn size={28} color={isDark ? '#7C8BFF' : '#2C2418'} />
      </div>

      <div>
        <h3 style={{ fontSize: '19px', fontWeight: '800', color: textColor, margin: '0 0 8px 0', letterSpacing: '-0.3px' }}>
          {title}
        </h3>
        <p style={{ fontSize: '13px', color: subText, margin: 0, lineHeight: '1.55' }}>
          {description}
        </p>
      </div>

      {/* Info Badge: Isolation Guarantee */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: badgeBg,
          padding: '8px 12px',
          borderRadius: '12px',
          fontSize: '11px',
          color: subText,
          fontWeight: '500',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <ShieldCheck size={15} color="#16A34A" />
        <span>Tabungan pribadi Anda tetap 100% aman & tanpa login</span>
      </div>

      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isDark ? '#3D2626' : '#FDE8E8',
            color: '#DC2626',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '12px',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px 20px',
          borderRadius: '999px',
          border: 'none',
          backgroundColor: '#FFFFFF',
          color: '#2C2418',
          fontWeight: '700',
          fontSize: '14px',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          fontFamily: 'inherit',
          opacity: loading ? 0.8 : 1,
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" color="#666" />
            <span>Menghubungkan Akun Google...</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Tautkan Akun Google</span>
          </>
        )}
      </button>
    </div>
  )
}
