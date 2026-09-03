import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 

 
export const { auth, signIn, handlers, signOut, unstable_update } = NextAuth({
  ...authConfig
});