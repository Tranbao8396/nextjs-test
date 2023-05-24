// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  // const protectedPaths = ["/dashboard"];
  // const isPathProtected = protectedPaths?.some((path) => pathname == path);
  const loginPaths = ["/login"];
  const isPathLogin = loginPaths?.some((path) => pathname == path)
  const res = NextResponse.next();
  const token = await getToken({ req });

  // if (isPathProtected) {
  //   if (!token) {
  //     const url = new URL(`/login`, req.url);
  //     url.searchParams.set("callbackUrl", pathname);
  //     return NextResponse.redirect(url);
  //   }
  // }

  if (isPathLogin) {
    if (token) {
      const home = new URL(`/`, req.url);
      return NextResponse.redirect(home);
    }
  }
  return res;
}
