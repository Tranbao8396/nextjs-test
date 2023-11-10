import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Test",

      credentials: {
        name: { label: "Name", type: "text", placeholder: "aaa@aaa.com" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials, req) {
        const res = await fetch("http://localhost:3001/users/check", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const user = await res.json()

        if (res.ok && user) {
          return user;
        } else {
          return null
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
});