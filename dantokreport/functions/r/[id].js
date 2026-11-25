/*
 * GET /r/:id  →  결과 페이지(r.html)를 그대로 보여줍니다.
 * 결과 요약은 페이지가 열린 뒤 /api/s/:id 에서 가져옵니다. (주소는 짧은 그대로 유지)
 */
export async function onRequestGet({ request, env }) {
  const page = await env.ASSETS.fetch(new URL('/r', request.url));
  const headers = new Headers(page.headers);
  headers.set('X-Robots-Tag', 'noindex');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  return new Response(page.body, { status: page.status, headers });
}
