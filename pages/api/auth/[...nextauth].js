import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { checkUserCredentials } from '../../../data/users';

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Test",

      credentials: {
        name: { label: "Name", type: "text", placeholder: "aaa@aaa.com" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        const user = await checkUserCredentials(credentials || {});
        return user || null;
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
});
