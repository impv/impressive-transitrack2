import { upsertMemberByEmail } from "@/lib/db/member";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

/**
 * NextAuthを使ったGoogleログイン認証の設定
 */

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
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
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

      // メンバー情報を追加
      try {
        const member = await upsertMemberByEmail({
          email: email.toLowerCase(),
          name: user.name ?? email,
          isAdmin: false,
        });

        if (user) {
          user.id = member.id;
          user.isAdmin = member.isAdmin;
        }
      } catch (error) {
        console.error("メンバー情報の更新に失敗しました", error);
        return false;
      }
      return true;
    },

    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
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
