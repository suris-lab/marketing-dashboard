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
      const email = profile?.email;
      if (!email) return false;

      // ALLOWED_EMAILS: comma-separated list e.g. "a@gmail.com,b@xxiihk.com"
      const allowedEmails = process.env.ALLOWED_EMAILS
        ?.split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean) ?? [];

      // ALLOWED_EMAIL_DOMAIN: e.g. "xxiihk.com"
      const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN?.trim().toLowerCase();

      // If neither is set, allow all (open access)
      if (allowedEmails.length === 0 && !allowedDomain) return true;

      if (allowedEmails.includes(email.toLowerCase())) return true;
      if (allowedDomain && email.toLowerCase().endsWith(`@${allowedDomain}`)) return true;

      return false;
    },
  },
};
