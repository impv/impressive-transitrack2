import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const companyDomain = process.env.COMPANY_DOMAIN;

const adminEmails = new Set(
	(process.env.ADMIN_EMAILS ?? "")
		.split(",")
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean),
);

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

			// Googleのプロフィール情報からメール検証とドメインチェック
			const googleProfile = profile as { email_verified?: boolean; email?: string };
			const { email_verified, email } = googleProfile;

			const isValidAuth = companyDomain && email_verified && email && email.endsWith(companyDomain);

			if (!isValidAuth) {
				return false;
			}

			/** TODO: DBが用意できたら差し替え（現在は暫定的に.envで管理者を指定） */
			if (user) {
				user.isAdmin = adminEmails.has(email.toLowerCase());
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
