// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const protectedPaths = ["/dashboard", "/profile"];
  const isPathProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const authPages = ["/login", "/register"];
  const isAuthPage = authPages.some((path) => pathname.startsWith(path));
  const res = NextResponse.next();
  const token = await getToken({ req });

  if (isPathProtected && !token) {
    const url = new URL(`/login`, req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/dashboard") && token?.roles === 'user') {
    const url = new URL(`/`, req.url);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && token) {
    const home = new URL(`/profile`, req.url);
    return NextResponse.redirect(home);
  }

  return res;
}
