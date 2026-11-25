/*
 * GET /api/s/:id  →  { d: "<결과 요약 문자열>" }
 * 짧은 링크로 연 결과 페이지가 요약을 가져갈 때 씁니다. 30일이 지나면 404.
 */
import { ID_RE, json } from '../../_lib.js';

export async function onRequestGet({ params, env }) {
  const id = String(params.id || '');
  if (!ID_RE.test(id) || !env.SHARE) return json({ error: 'not_found' }, 404);
  const d = await env.SHARE.get('s:' + id);
  if (d === null) return json({ error: 'not_found' }, 404);
  return json({ d }, 200, { 'Cache-Control': 'private, max-age=300', 'X-Robots-Tag': 'noindex' });
}
