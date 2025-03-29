import { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import GithubProvider from 'next-auth/providers/github';
import { supabaseServer } from './supabase';

// Supabase adapter for NextAuth.js
function CustomAdapter(): Adapter {
  return {
    async createUser(user) {
      const { data, error } = await supabaseServer
        .from('users')
        .insert({
          email: user.email,
          name: user.name,
          avatar_url: user.image,
          github_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        image: data.avatar_url,
        emailVerified: null,
      };
    },
    async getUser(id) {
      const { data, error } = await supabaseServer
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) return null;
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        image: data.avatar_url,
        emailVerified: null,
      };
    },
    async getUserByEmail(email) {
      const { data, error } = await supabaseServer
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) return null;
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        image: data.avatar_url,
        emailVerified: null,
      };
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const { data, error } = await supabaseServer
        .from('users')
        .select('*')
        .eq('github_id', providerAccountId)
        .single();

      if (error || !data) return null;
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        image: data.avatar_url,
        emailVerified: null,
      };
    },
    async updateUser(user) {
      const { data, error } = await supabaseServer
        .from('users')
        .update({
          name: user.name,
          email: user.email,
          avatar_url: user.image,
          updated_at: new Date(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        image: data.avatar_url,
        emailVerified: null,
      };
    },
    async deleteUser(userId) {
      const { error } = await supabaseServer
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      return;
    },
    async linkAccount(account) {
      // In this implementation, we're using GitHub ID directly
      // We don't need to implement this method for our simplified approach
      return account;
    },
    async unlinkAccount({ providerAccountId, provider }) {
      // Not implementing for this simplified version
      return;
    },
    async createSession({ sessionToken, userId, expires }) {
      const { data, error } = await supabaseServer
        .from('sessions')
        .insert({
          id: sessionToken,
          user_id: userId,
          expires_at: expires.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return {
        sessionToken: data.id,
        userId: data.user_id,
        expires: new Date(data.expires_at),
      };
    },
    async getSessionAndUser(sessionToken) {
      const { data: session, error: sessionError } = await supabaseServer
        .from('sessions')
        .select('*, user_id')
        .eq('id', sessionToken)
        .single();

      if (sessionError || !session) return null;

      const { data: user, error: userError } = await supabaseServer
        .from('users')
        .select('*')
        .eq('id', session.user_id)
        .single();

      if (userError || !user) return null;

      return {
        session: {
          sessionToken: session.id,
          userId: session.user_id,
          expires: new Date(session.expires_at),
        },
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar_url,
          emailVerified: null,
        },
      };
    },
    async updateSession({ sessionToken, expires, userId }) {
      const { data, error } = await supabaseServer
        .from('sessions')
        .update({
          expires_at: expires?.toISOString(),
          user_id: userId,
        })
        .eq('id', sessionToken)
        .select()
        .single();

      if (error || !data) return null;
      return {
        sessionToken: data.id,
        userId: data.user_id,
        expires: new Date(data.expires_at),
      };
    },
    async deleteSession(sessionToken) {
      await supabaseServer
        .from('sessions')
        .delete()
        .eq('id', sessionToken);
    },
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  adapter: CustomAdapter(),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};
