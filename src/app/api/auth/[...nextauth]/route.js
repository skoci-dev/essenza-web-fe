import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials, req) {
        // 🧠 Bypass mode
        if (process.env.NODE_ENV === 'development') {
          console.log('⚡ Dev login bypass active')

          // return user object → artinya login sukses
          return { id: 1, name: 'Dev User', email: 'dev@example.com' }
        }

        // ✳️ Normal auth logic kamu di sini
        // Misal:
        // const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        // if (!user || user.password !== credentials.password) return null
        // return user

        return null
      }
    })
  ],

  session: { strategy: 'jwt' },
  jwt: { secret: process.env.NEXTAUTH_SECRET },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user

      return token
    },
    async session({ session, token }) {
      session.user = token.user

      return session
    }
  },

  pages: {
    error: '/login' // Redirect error ke login, bukan /api/auth/error
  }
})

export { handler as GET, handler as POST }
