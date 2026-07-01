import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { verifyUserCredentials } from "../../../data/mockUsers";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Test",

      credentials: {
        name: { label: "Name", type: "text", placeholder: "demo" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials, req) {
        const user = await verifyUserCredentials(credentials?.name, credentials?.password);

        if (user) {
          return user;
        } else {
          return null;
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id || token.sub;
        token.roles = user.roles || "user";
        token.provider = user.provider || account?.provider || "credentials";
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id || token.sub;
      session.user.roles = token.roles || "user";
      session.user.provider = token.provider || "credentials";
      return session;
    },
  },
};

export default NextAuth(authOptions);
