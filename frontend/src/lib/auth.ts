import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const authConfig = NextAuth({
  secret: process.env.AUTH_SECRET || "dev-secret-change-in-production",
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
});

export const { handlers, signIn, signOut, auth } = authConfig;
