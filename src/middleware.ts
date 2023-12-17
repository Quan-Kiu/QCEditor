import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const user = request.cookies.get("user")?.value;

  const userData = JSON.parse(user || "0");

  if (!!userData) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/"],
};
