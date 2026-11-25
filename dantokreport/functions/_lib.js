/*
 * 단톡 리포트 - 짧은 결과 링크 공통 코드 (Cloudflare Pages Functions)
 *
 * 저장하는 것: 이용자가 "결과 링크 복사"를 누를 때 만든 통계 요약(링크용 문자열)뿐입니다.
 *             원본 대화는 받지도 저장하지도 않습니다.
 * 보관 기간: 30일이 지나면 Cloudflare KV가 자동으로 지웁니다.
 */

export const TTL_SECONDS = 60 * 60 * 24 * 30;        // 30일
export const MAX_DATA = 6000;                         // 링크용 문자열 최대 길이
export const ID_RE = /^[A-Za-z0-9]{6,12}$/;
const ALPHABET = '23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';   // 헷갈리는 0·O·1·l·I 제외

export function newId(len = 7) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let id = '';
  for (const b of bytes) id += ALPHABET[b % ALPHABET.length];
  return id;
}

export function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra }
  });
}

function fromB64url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const bin = atob(str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** 우리 사이트가 만든 결과 요약 형식인지 확인 (아무 데이터나 저장되지 않도록) */
export async function isValidPayload(d) {
  if (typeof d !== 'string' || d.length < 10 || d.length > MAX_DATA) return false;
  if (!/^[zj][A-Za-z0-9_-]+$/.test(d)) return false;
  try {
    let bytes = fromB64url(d.slice(1));
    if (d[0] === 'z') {
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
      bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    }
    if (bytes.length > 50000) return false;
    const o = JSON.parse(new TextDecoder().decode(bytes));
    return !!o && o.v === 1 && typeof o.t === 'number' && Array.isArray(o.p);
  } catch (e) {
    return false;
  }
}

/** 다른 사이트에서 이 API를 쓰지 못하게, 요청을 보낸 페이지 주소 확인 */
export function allowedOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true;   // 같은 사이트의 일부 요청은 Origin이 없음
  try {
    const host = new URL(origin).hostname;
    return host === 'dantokreport.com' || host === 'www.dantokreport.com' ||
      host === 'dantokreport.pages.dev' || host.endsWith('.dantokreport.pages.dev') ||
      host === 'localhost' || host === '127.0.0.1';
  } catch (e) {
    return false;
  }
}
