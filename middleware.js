// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getUserData } from "./data/users";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const protectedPaths = "/dashboard";
  const isPathProtected = pathname.includes(protectedPaths);
  const loginPaths = "/login";
  const isPathLogin = pathname.includes(loginPaths)
  const res = NextResponse.next();
  const token = await getToken({ req });

  if (isPathProtected) {
    if (!token) {
      const url = new URL(`/login`, req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    } else {
      const user_id = token.sub;
      const user = await getUserData(user_id);

      if ( user.roles === 'user') {
        const url = new URL(`/`, req.url);
        return NextResponse.redirect(url);
      }
    }
  }

  if (isPathLogin) {
    if (token) {
      const home = new URL(`/`, req.url);
      return NextResponse.redirect(home);
    }
  }
  return res;
}
