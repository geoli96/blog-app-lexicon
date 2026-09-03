import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import z from "zod";
import bcrypt from "bcrypt";
import axios from "axios";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user, trigger }) {
        if(trigger === "update" && token){
            const user = (await axios.get(`http://localhost:4000/users/${(token as unknown as any).user.id}`)).data;
            if(user){
                delete user.password;
                token.user = user;
            }
        }
      if (user) {
        token.user = user;
      }
      return token;
    }
  },
  providers: [
      Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
                .object({ username: z.string(), password: z.string() })
                .parse(credentials);

            const { username, password } = parsedCredentials;
            const user = await getUser(username);
            if (!user?.id) return null;
            const passwordsMatch = await bcrypt.compare(password, user.password);
            delete user.password; // Remove password from user object before returning
            if (passwordsMatch) return user;
            return null;
        },
      }),
    ],
} satisfies NextAuthConfig;

async function getUser(username: string): Promise<any> {
  try {
    const user = await axios.get('http://localhost:4000/users', {
      params: { username },
    });
    return user.data[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
