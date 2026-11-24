/*
 * 단톡 리포트 - 결과 공유 링크
 *
 * 분석 결과 "요약"만 링크의 # 뒤(fragment)에 담습니다.
 *  - # 뒤의 내용은 브라우저가 서버로 보내지 않으므로 운영자 서버에 전송·저장되지 않습니다.
 *  - 원본 대화 내용은 담지 않습니다. (순위, 칭호, 시간대·요일·월별 숫자, 많이 쓴 단어만)
 *  - 링크를 받은 사람은 누구나 이 요약을 볼 수 있습니다.
 */
(function (root) {
  'use strict';

  var VERSION = 1;
  var MAX_PEOPLE = 10, MAX_WORDS = 24, MAX_MONTHS = 120;

  /* ---------- base64url ---------- */
  function toB64url(bytes) {
    var bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function fromB64url(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    var bin = atob(str), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function pipe(bytes, stream) {
    return new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer()
      .then(function (buf) { return new Uint8Array(buf); });
  }

  /** 객체 → 링크용 문자열 ('z'=deflate 압축, 'j'=비압축) */
  function encode(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    var plain = 'j' + toB64url(bytes);
    return Promise.resolve().then(function () {
      // 'deflate'는 CompressionStream을 지원하는 모든 브라우저에서 쓸 수 있는 형식입니다.
      if (typeof CompressionStream !== 'function') return plain;
      return pipe(bytes, new CompressionStream('deflate')).then(function (z) { return 'z' + toB64url(z); });
    }).catch(function () { return plain; });
  }

  /** 링크용 문자열 → 객체 */
  function decode(str) {
    return Promise.resolve().then(function () {
      var kind = str.charAt(0), bytes = fromB64url(str.slice(1));
      if (kind === 'z') {
        if (typeof DecompressionStream !== 'function') throw new Error('unsupported');
        return pipe(bytes, new DecompressionStream('deflate'));
      }
      if (kind === 'j') return bytes;
      throw new Error('bad');
    }).then(function (bytes) { return JSON.parse(new TextDecoder().decode(bytes)); });
  }

  /* ---------- 분석 결과 ↔ 공유용 요약 ---------- */

  /**
   * @param {object} a  TalkStats.analyze 결과
   * @param {function} nameFn  이름 변환(이름 가리기 적용)
   * @param {string} room  표시할 방 이름
   */
  function toPayload(a, nameFn, room) {
    return {
      v: VERSION,
      r: room,
      t: a.total, s: a.start, e: a.end, d: a.days, ad: a.activeDays, n: a.people.length,
      p: a.people.slice(0, MAX_PEOPLE).map(function (p) {
        return [nameFn(p.name), p.count, p.laugh, p.photo, p.emoticon, Math.round(p.avgLen * 10)];
      }),
      w: a.awards.map(function (x) { return [x.icon, x.title, nameFn(x.name), x.desc]; }),
      h: a.hours, wd: a.weekdays, hm: a.heat,
      m: a.months.slice(-MAX_MONTHS).map(function (x) { return [x.key, x.count]; }),
      hd: a.hotDays.map(function (x) { return [x.date, x.count]; }),
      wo: a.words.slice(0, MAX_WORDS).map(function (x) { return [x.word, x.count]; }),
      ph: a.peakHour, pd: a.peakDay
    };
  }

  // 링크는 누구나 만들 수 있으므로, 받은 값은 모두 형식을 강제해서 씁니다.
  function num(x) { x = Number(x); return isFinite(x) && x >= 0 ? x : 0; }
  function int(x, max) { x = Math.floor(num(x)); return max != null ? Math.min(x, max) : x; }
  function str(x, max) { return String(x == null ? '' : x).slice(0, max || 60); }
  function arr(x, max) { return Array.isArray(x) ? x.slice(0, max) : []; }
  function nums(x, len) { var out = []; for (var i = 0; i < len; i++) out.push(int(arr(x, len)[i])); return out; }
  function key(x, re) { x = str(x, 10); return re.test(x) ? x : ''; }

  /** 공유용 요약 → 화면에 그릴 수 있는 분석 결과 형태 */
  function fromPayload(o) {
    if (!o || o.v !== VERSION) throw new Error('version');
    var total = int(o.t);
    var people = arr(o.p, MAX_PEOPLE).map(function (p) {
      p = arr(p, 6);
      var count = int(p[1]);
      return { name: str(p[0], 30) || '?', count: count, share: total ? count / total : 0,
               laugh: int(p[2]), photo: int(p[3]), emoticon: int(p[4]), avgLen: int(p[5]) / 10 };
    });
    var heat = [];
    for (var d = 0; d < 7; d++) heat.push(nums(arr(o.hm, 7)[d], 24));
    var days = int(o.d);
    return {
      shared: true,
      roomName: str(o.r, 30),
      total: total, start: num(o.s), end: num(o.e), days: days, activeDays: int(o.ad),
      perDay: days ? total / days : 0, peopleCount: int(o.n),
      people: people,
      awards: arr(o.w, 12).map(function (x) {
        x = arr(x, 4);
        return { icon: str(x[0], 4), title: str(x[1], 20), name: str(x[2], 30), desc: str(x[3], 40) };
      }),
      hours: nums(o.h, 24), weekdays: nums(o.wd, 7), heat: heat,
      months: arr(o.m, MAX_MONTHS).map(function (x) { x = arr(x, 2); return { key: key(x[0], /^\d{4}-\d{2}$/), count: int(x[1]) }; })
        .filter(function (x) { return x.key; }),
      hotDays: arr(o.hd, 5).map(function (x) { x = arr(x, 2); return { date: key(x[0], /^\d{4}-\d{2}-\d{2}$/), count: int(x[1]) }; })
        .filter(function (x) { return x.date; }),
      words: arr(o.wo, MAX_WORDS).map(function (x) { x = arr(x, 2); return { word: str(x[0], 15), count: int(x[1]) }; }),
      peakHour: int(o.ph, 23), peakDay: int(o.pd, 6)
    };
  }

  var api = { encode: encode, decode: decode, toPayload: toPayload, fromPayload: fromPayload };
  root.TalkShare = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
