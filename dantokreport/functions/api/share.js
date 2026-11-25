/*
 * POST /api/share  { d: "<결과 요약 문자열>" }  →  { id: "x7Kp2aB" }
 * 결과 요약을 30일 동안 보관하고 짧은 링크용 id를 돌려줍니다.
 */
import { TTL_SECONDS, MAX_DATA, newId, json, isValidPayload, allowedOrigin } from '../_lib.js';

export async function onRequestPost({ request, env }) {
  if (!allowedOrigin(request)) return json({ error: 'forbidden' }, 403);
  if (!env.SHARE) return json({ error: 'not_configured' }, 500);

  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > MAX_DATA + 200) return json({ error: 'too_large' }, 413);

  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad_request' }, 400); }
  const d = body && body.d;
  if (!(await isValidPayload(d))) return json({ error: 'invalid' }, 400);

  for (let i = 0; i < 4; i++) {
    const id = newId(7);
    const key = 's:' + id;
    if (await env.SHARE.get(key) !== null) continue;   // 아주 드물게 겹치면 다시 뽑기
    await env.SHARE.put(key, d, { expirationTtl: TTL_SECONDS });
    return json({ id, days: TTL_SECONDS / 86400 }, 201);
  }
  return json({ error: 'try_again' }, 503);
}
