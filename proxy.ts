import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default async function proxy(request:any) {
    return NextAuth(authConfig).auth(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
