// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getUserData } from "./data/users";
import { decideRouteAccess } from "./lib/auth/routeAccess";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const res = NextResponse.next();
  const token = await getToken({ req });
  const user = token?.sub ? await getUserData(token.sub) : null;
  const decision = decideRouteAccess({ pathname, token, user });

  if (decision.action === 'login') {
    const url = new URL(`/login`, req.url);
    url.searchParams.set("callbackUrl", decision.callbackUrl);
    return NextResponse.redirect(url);
  }
  if (decision.action === 'home') {
    return NextResponse.redirect(new URL(`/`, req.url));
  }
  return res;
}
