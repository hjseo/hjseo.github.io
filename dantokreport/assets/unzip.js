/*
 * 단톡 리포트 - 압축 파일(.zip)에서 대화 파일 꺼내기
 *
 * - 모든 처리는 브라우저 안에서만 합니다. 아무것도 전송하지 않습니다.
 * - 사진·동영상이 들어 있는 큰 zip도 통째로 읽지 않습니다.
 *   목차(central directory)만 읽어 .txt/.csv 파일을 찾고, 그 파일 부분만 잘라서 압축을 풉니다.
 * - 압축 해제는 브라우저 기본 기능(DecompressionStream 'deflate-raw')을 씁니다.
 */
(function (root) {
  'use strict';

  var SIG_EOCD = 0x06054b50, SIG_EOCD64 = 0x06064b50, SIG_LOC64 = 0x07064b50;
  var SIG_CEN = 0x02014b50, SIG_LOCAL = 0x04034b50;
  var MAX_TEXT = 300 * 1024 * 1024;   // 압축을 푼 대화 파일 최대 300MB

  function err(code) { var e = new Error(code); e.code = code; return e; }

  function slice(file, start, end) {
    return file.slice(start, end).arrayBuffer().then(function (b) { return new DataView(b); });
  }
  function u64(v, o) { return v.getUint32(o, true) + v.getUint32(o + 4, true) * 4294967296; }

  /** zip 파일인지 (앞 4바이트가 PK\3\4) */
  function isZip(file) {
    return slice(file, 0, 4).then(function (v) {
      return v.byteLength === 4 && v.getUint32(0, true) === SIG_LOCAL;
    }).catch(function () { return false; });
  }

  /** 목차를 읽어 파일 목록을 돌려줌 */
  function listEntries(file) {
    var size = file.size;
    var tailLen = Math.min(size, 65535 + 22 + 20);
    var tailStart = size - tailLen;
    return slice(file, tailStart, size).then(function (tail) {
      var pos = -1;
      for (var i = tail.byteLength - 22; i >= 0; i--) {
        if (tail.getUint32(i, true) === SIG_EOCD) { pos = i; break; }
      }
      if (pos < 0) throw err('not_zip');
      var count = tail.getUint16(pos + 10, true);
      var cdSize = tail.getUint32(pos + 12, true);
      var cdOffset = tail.getUint32(pos + 16, true);
      // ZIP64 (아주 큰 압축 파일)
      if ((count === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) && pos >= 20 &&
          tail.getUint32(pos - 20, true) === SIG_LOC64) {
        var eocd64At = u64(tail, pos - 20 + 8);
        return slice(file, eocd64At, eocd64At + 56).then(function (e64) {
          if (e64.getUint32(0, true) !== SIG_EOCD64) throw err('not_zip');
          return readDirectory(file, u64(e64, 48), u64(e64, 40));
        });
      }
      return readDirectory(file, cdOffset, cdSize);
    });
  }

  function readDirectory(file, offset, length) {
    if (offset + length > file.size || length > 64 * 1024 * 1024) throw err('not_zip');
    return slice(file, offset, offset + length).then(function (cd) {
      var out = [], p = 0;
      var utf8 = new TextDecoder('utf-8');
      while (p + 46 <= cd.byteLength && cd.getUint32(p, true) === SIG_CEN) {
        var flags = cd.getUint16(p + 8, true);
        var method = cd.getUint16(p + 10, true);
        var comp = cd.getUint32(p + 20, true);
        var size = cd.getUint32(p + 24, true);
        var nameLen = cd.getUint16(p + 28, true);
        var extraLen = cd.getUint16(p + 30, true);
        var commentLen = cd.getUint16(p + 32, true);
        var local = cd.getUint32(p + 42, true);
        var nameBytes = new Uint8Array(cd.buffer, cd.byteOffset + p + 46, nameLen);
        var name = utf8.decode(nameBytes);
        // ZIP64 추가 정보: 0xffffffff 인 값만 순서대로 들어 있음
        var x = p + 46 + nameLen, xEnd = x + extraLen;
        while (x + 4 <= xEnd) {
          var id = cd.getUint16(x, true), len = cd.getUint16(x + 2, true), q = x + 4;
          if (id === 0x0001) {
            if (size === 0xffffffff) { size = u64(cd, q); q += 8; }
            if (comp === 0xffffffff) { comp = u64(cd, q); q += 8; }
            if (local === 0xffffffff) { local = u64(cd, q); q += 8; }
          }
          x += 4 + len;
        }
        out.push({ name: name, method: method, encrypted: !!(flags & 1), comp: comp, size: size, local: local });
        p += 46 + nameLen + extraLen + commentLen;
      }
      return out;
    });
  }

  /** 파일 하나의 압축을 풀어 ArrayBuffer로 */
  function readEntry(file, e) {
    if (e.encrypted) return Promise.reject(err('encrypted'));
    if (e.size > MAX_TEXT) return Promise.reject(err('too_large'));
    return slice(file, e.local, e.local + 30).then(function (h) {
      if (h.getUint32(0, true) !== SIG_LOCAL) throw err('broken');
      var start = e.local + 30 + h.getUint16(26, true) + h.getUint16(28, true);
      var data = file.slice(start, start + e.comp);
      if (e.method === 0) return data.arrayBuffer();
      if (e.method !== 8) throw err('unsupported');
      if (typeof DecompressionStream !== 'function') throw err('no_inflate');
      var ds;
      try { ds = new DecompressionStream('deflate-raw'); } catch (x) { throw err('no_inflate'); }
      return new Response(data.stream().pipeThrough(ds)).arrayBuffer();
    });
  }

  /** 대화 파일 후보: .txt/.csv, 맥 숨김 파일 제외, 큰 것부터 */
  function candidates(entries) {
    return entries.filter(function (e) {
      var n = e.name.toLowerCase();
      var base = n.split('/').pop();
      return /\.(txt|csv)$/.test(n) && n.indexOf('__macosx/') !== 0 && base.charAt(0) !== '.' && e.size > 0;
    }).sort(function (a, b) { return b.size - a.size; });
  }

  /**
   * zip에서 대화가 가장 많이 들어 있는 파일을 찾아 돌려줌
   * @param {File} file
   * @param {function(ArrayBuffer):{count:number, text:string}} probe 꺼낸 파일을 읽어 메시지 수를 세는 함수
   * @returns {Promise<{name:string, text:string, count:number}>}
   */
  function findChat(file, probe) {
    return listEntries(file).then(function (entries) {
      var list = candidates(entries).slice(0, 6);
      if (!list.length) throw err('no_text');
      var best = null, lastErr = null, i = 0;
      function next() {
        if (i >= list.length) {
          if (best) return best;
          throw lastErr || err('no_chat');
        }
        var e = list[i++];
        return readEntry(file, e).then(function (buf) {
          var r = probe(buf);
          if (r.count > 0 && (!best || r.count > best.count)) best = { name: e.name, text: r.text, count: r.count };
          // 가장 큰 파일에서 대화를 찾았으면 보통 그게 정답이라 바로 끝냄
          if (best && i === 1) return best;
          return next();
        }, function (x) { lastErr = x; return next(); });
      }
      return next();
    });
  }

  var api = { isZip: isZip, listEntries: listEntries, findChat: findChat };
  root.TalkUnzip = api;
})(typeof window !== 'undefined' ? window : globalThis);
