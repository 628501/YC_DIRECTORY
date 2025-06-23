import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { client } from "./sanity/lib/client"
import { AUTHOR_BY_GITHUBID_QUERY } from "./sanity/lib/queries"
import { writeClient } from "./sanity/lib/write-client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user: { name, email, image }, profile }: any) {
      const { id, login, bio } = profile;

      const existingUser = await client.fetch(AUTHOR_BY_GITHUBID_QUERY, { id });

      if (!existingUser) {
        await writeClient.withConfig({ useCdn: false }).create({
          _type: "author",
          _id: `github-${id}`,
          id,
          name,
          username: login,
          email,
          image,
          bio: bio || ""
        });
      }

      return true;
    },
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        const user = await client.withConfig({ useCdn: false }).fetch(AUTHOR_BY_GITHUBID_QUERY, { id: profile?.id })
        token.id = user?._id;
      }
      return token
    },
    async session({ session, token }: any) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});
