import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from '@/services/auth.service';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const response = await authService.login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (response.success && response.data) {
            const { user, token, refreshToken } = response.data;
            
            return {
              id: user._id,
              email: user.email,
              name: user.fullName,
              role: user.role,
              organization: user.organization,
              organizationCode: user.organizationCode,
              employeeCode: user.employeeCode || '',
              accessToken: token,
              refreshToken: refreshToken,
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organization = user.organization;
        token.organizationCode = user.organizationCode;
        token.employeeCode = user.employeeCode;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      
      if (trigger === 'update' && session) {
        return { ...token, ...session };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as number;
        session.user.organization = token.organization as string;
        session.user.organizationCode = token.organizationCode as string;
        session.user.employeeCode = token.employeeCode as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || 
                           nextUrl.pathname.startsWith('/employees') ||
                           nextUrl.pathname.startsWith('/attendance') ||
                           nextUrl.pathname.startsWith('/leaves') ||
                           nextUrl.pathname.startsWith('/payroll') ||
                           nextUrl.pathname.startsWith('/documents') ||
                           nextUrl.pathname.startsWith('/roles') ||
                           nextUrl.pathname.startsWith('/settings');
      const isOnAuth = nextUrl.pathname.startsWith('/login') || 
                      nextUrl.pathname.startsWith('/register');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isOnAuth) {
        if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
      }
      
      return true;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});
