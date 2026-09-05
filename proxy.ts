import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import fs from 'fs/promises'
const writeFileAtomic = require('write-file-atomic')

export default async function proxy(request:any) {
  if(request.method === "POST" || request.method === "PUT"){
    try {
      const db = await fs.readFile("db.json");
      await writeFileAtomic('dbCopy.json', db)
      console.log("Copied db");

      return NextAuth(authConfig).auth(request);
    } catch (error) {
      console.log(error)
    }
  }else{
    return NextAuth(authConfig).auth(request);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
