import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        // Dev bypass mode
        if (process.env.NEXT_PUBLIC_APP_ENV === 'dev') {
          return { id: 1, name: 'Dev User', email: 'dev@example.com' }
        }

        // Production logic — hanya return user agar login sukses
        const user = {
          id: 1,
          name: 'Prod User',
          email: 'prod@example.com'
        }

        return user // <-- penting, JANGAN return null
      }
    })
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user

      return token
    },
    async session({ session, token }) {
      session.user = token.user

      return session
    }
  }
})

export { handler as GET, handler as POST }
