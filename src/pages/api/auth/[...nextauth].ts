import { checkIsAdmin, upsertMemberByEmail } from "@/lib/db/member";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

const companyDomain = process.env.COMPANY_DOMAIN;

const GoogleProfileSchema = z.object({
  email_verified: z.boolean(),
  email: z.string(),
});

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      console.log("[DB]", {
        host: (() => {
          try {
            return new URL(process.env.DATABASE_URL ?? "").host;
          } catch {
            return "invalid";
          }
        })(),
        sslmode: (() => {
          try {
            return new URL(process.env.DATABASE_URL ?? "").searchParams.get("sslmode");
          } catch {
            return null;
          }
        })(),
      });

      if (account?.provider !== "google") return false;

      const parseResult = GoogleProfileSchema.safeParse(profile);
      if (!parseResult.success) {
        console.error("データの形式が不正です", parseResult.error);
        return false;
      }
      const { email_verified, email } = parseResult.data;

      const isValidAuth = companyDomain && email_verified && email.endsWith(`@${companyDomain}`);

      if (!isValidAuth) {
        return false;
      }

      await upsertMemberByEmail({
        email: email.toLowerCase(),
        name: user.name ?? email,
        isAdmin: false,
      });

      if (user) {
        user.isAdmin = await checkIsAdmin(email.toLowerCase());
      }
      return true;
    },

    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user?.id;
        token.isAdmin = user.isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.isAdmin = token.isAdmin ?? false;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/loginError",
  },
};

export default NextAuth(authOptions);
