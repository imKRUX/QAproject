import Link from 'next/link'
import { auth, signOut } from '@/auth'
import { NavLinks } from './NavLinks'

export async function Navbar() {
  const session = await auth()

  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'SH'

  return (
    <header className="border-b border-orange-100 sticky top-0 z-10 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3 sm:gap-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            SH
          </div>
          <div className="leading-none hidden sm:block">
            <div className="font-bold text-stone-900 text-base">SkillHub</div>
            <div className="text-[10px] text-orange-600/70 uppercase tracking-wider">Community Hub</div>
          </div>
        </Link>

        <NavLinks />

        <div className="flex items-center gap-3 shrink-0">
          {session?.user ? (
            <>
              <div className="flex items-center gap-2.5">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? ''}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: '#ea580c' }}
                  >
                    {initials}
                  </div>
                )}
                <div className="hidden sm:block">
                  <div className="text-[10px] text-stone-400 uppercase tracking-wide">Signed in as</div>
                  <div className="text-sm font-medium text-stone-900">{session.user.name}</div>
                </div>
              </div>
              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/' })
                }}
              >
                <button
                  type="submit"
                  className="text-xs font-semibold text-stone-500 border border-stone-200 px-3 py-1.5 rounded-lg transition-colors hover:text-orange-700 hover:bg-orange-50 hover:border-orange-200"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#ea580c' }}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
