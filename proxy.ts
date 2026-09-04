import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import fs from 'fs/promises'

//export default NextAuth(authConfig).auth;

export default async function proxy(request:any) {
  if(request.method === "POST" || request.method === "PUT"){
     await fs.copyFile("db.json", "dbCopy.json");
    console.log("Copied db");
  }
  return NextAuth(authConfig).auth(request)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
