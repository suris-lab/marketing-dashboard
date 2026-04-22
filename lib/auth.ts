import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ profile }) {
      // Restrict to specific domain if ALLOWED_EMAIL_DOMAIN is set
      const domain = process.env.ALLOWED_EMAIL_DOMAIN;
      if (domain && profile?.email) {
        return profile.email.endsWith(`@${domain}`);
      }
      return true;
    },
  },
};
