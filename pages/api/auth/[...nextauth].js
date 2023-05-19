import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

async function UserData(credential) {
  const users = await fetch("http://localhost:3000/api/users").then((res)=>res.json());
  let valid = false;
  users.map((user) => {
    if (credential.email === user.email && credential.password === user.password) {
      valid = true;
    }
  });
  return valid;
}

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Test',

      credentials: {
        email: { label: "Email", type: "email", placeholder: "aaa@aaa.com" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        const user = await UserData(credentials);

        if (user) {
          return user;
        } else {
          return null
        }
      }
    }),
  ],

  pages: {
    signIn: '/login',
  },

  // providers: [
  //   GoogleProvider({
  //     clientId: process.env.GOOGLE_ID,
  //     clientSecret: process.env.GOOGLE_SECRET,
  //   }),
  // ],
});