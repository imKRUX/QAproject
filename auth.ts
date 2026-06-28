import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'

// Test-only login: lets Cypress (and local dev) sign in with just an email,
// bypassing real Google OAuth. Disabled in production for safety.
const testProviders =
  process.env.NODE_ENV !== 'production'
    ? [
        Credentials({
          id: 'test-login',
          name: 'Test Login',
          credentials: { email: { label: 'Email', type: 'email' } },
          authorize: (credentials) => {
            const email = credentials?.email as string | undefined
            if (!email) return null
            return {
              id: email,
              email,
              name: email.split('@')[0],
            }
          },
        }),
      ]
    : []

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    ...testProviders,
  ],
  pages: {
    signIn: '/login',
  },
})
