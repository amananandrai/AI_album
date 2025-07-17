import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // Add more providers here
  ],
  // Add more NextAuth options here (callbacks, pages, etc.)
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 