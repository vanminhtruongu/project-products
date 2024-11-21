import { NextResponse } from 'next/server'
 
export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/register';
  const token = request.cookies.get('token')?.value || '';

  // Nếu người dùng đã đăng nhập và cố truy cập trang login/register
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // Nếu người dùng chưa đăng nhập và cố truy cập các trang được bảo vệ
  if (!isPublicPath && !token && (
    path.startsWith('/products') || 
    path.startsWith('/cart') || 
    path.startsWith('/checkout') || 
    path.startsWith('/orders') || 
    path.startsWith('/profile')
  )) {
    return NextResponse.redirect(new URL('/unauthorized', request.nextUrl));
  }

  // Nếu người dùng đã đăng nhập hoặc đang truy cập public path, cho phép tiếp tục
  return NextResponse.next();
}
 
export const config = {
  matcher: [
    '/products/:path*', 
    '/cart/:path*', 
    '/checkout/:path*', 
    '/orders/:path*', 
    '/profile/:path*',
    '/login', 
    '/register'
  ]
}
