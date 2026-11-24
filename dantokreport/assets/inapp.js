/*
 * 단톡 리포트 - 앱 안 브라우저(인앱 브라우저) 안내
 *
 * 메신저·SNS 앱 안에서 링크를 열면 파일 선택이나 이미지 저장(다운로드)이
 * 막히거나 다르게 동작하는 경우가 많습니다. 그래서
 *  1) 앱 안 브라우저를 감지해 위쪽에 안내 배너를 띄우고
 *  2) 가능한 앱에서는 "외부 브라우저로 열기" 버튼을, 안 되는 곳에서는 주소 복사와 방법 안내를 보여주고
 *  3) 이미지 저장 대신 "길게 눌러 저장"할 수 있는 이미지 화면을 띄웁니다.
 */
(function (root) {
  'use strict';

  // 앱 안 브라우저의 User-Agent 표시
  var IN_APP = /KAKAOTALK|NAVER\(inapp|Instagram|FBAN|FBAV|FB_IAB|\bLine\/|everytimeApp|DaumApps|BAND\/|; wv\)/i;
  var DISMISS_KEY = 'dantok-inapp-dismissed';

  /** @returns {{inApp:boolean, kind:'kakao'|'android'|'ios'|'other'|null}} */
  function detect(ua) {
    ua = ua || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
    if (!IN_APP.test(ua)) return { inApp: false, kind: null };
    if (/KAKAOTALK/i.test(ua)) return { inApp: true, kind: 'kakao' };
    if (/Android/i.test(ua)) return { inApp: true, kind: 'android' };
    if (/iPhone|iPad|iPod/i.test(ua)) return { inApp: true, kind: 'ios' };
    return { inApp: true, kind: 'other' };
  }

  /** 외부 브라우저로 바로 열 수 있는 주소. 불가능하면 null */
  function externalUrl(kind, url) {
    if (kind === 'kakao') return 'kakaotalk://web/openExternal?url=' + encodeURIComponent(url);
    // 안드로이드 Chrome 인텐트는 주소에 # 이 있으면 형식이 깨지므로 # 없는 주소만 지원
    if (kind === 'android' && url.indexOf('#') === -1 && /^https:\/\//.test(url)) {
      return 'intent://' + url.replace(/^https:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' +
        encodeURIComponent(url) + ';end';
    }
    return null;
  }

  function store(fn) { try { return fn(window.sessionStorage); } catch (e) { return null; } }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { /* 미지원 */ }
      ta.remove();
      ok ? resolve() : reject(new Error('copy'));
    });
  }

  /* ---------- 배너 ---------- */
  function showBanner(info) {
    if (store(function (s) { return s.getItem(DISMISS_KEY); })) return;
    var shared = document.body.getAttribute('data-page') === 'shared';
    var url = location.href;
    var ext = externalUrl(info.kind, url);

    var bar = document.createElement('div');
    bar.className = 'inapp';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', '외부 브라우저 안내');

    var title = shared ? '이미지 저장이 안 되면 외부 브라우저에서 열어 보세요' : '앱 안 브라우저로 열려 있어요';
    var desc = shared
      ? '앱 안에서는 결과 카드 이미지 저장이 막힐 수 있어요.'
      : '파일 선택이나 이미지 저장이 잘 안 될 수 있어요. Chrome이나 Safari에서 열면 더 편해요.';
    var how = info.kind === 'ios'
      ? '화면 아래나 위의 <b>⋯</b> 또는 <b>공유</b> 버튼을 누르고 <b>Safari로 열기</b>를 고르세요.'
      : '화면의 <b>⋮</b> 메뉴에서 <b>다른 브라우저로 열기</b>를 고르거나, 주소를 복사해 브라우저에 붙여 넣으세요.';

    bar.innerHTML =
      '<div class="inapp-text"><b>📱 ' + title + '</b><span>' + desc + '</span>' +
      (ext ? '' : '<span class="inapp-how">' + how + '</span>') + '</div>' +
      '<div class="inapp-actions">' +
      (ext ? '<a class="btn btn-primary" id="inappOpen" href="' + ext.replace(/"/g, '&quot;') + '">외부 브라우저로 열기</a>' : '') +
      '<button class="btn" id="inappCopy" type="button">주소 복사</button>' +
      '<button class="inapp-close" id="inappClose" type="button" aria-label="안내 닫기">✕</button>' +
      '</div>';

    var main = document.querySelector('main');
    var wrap = document.createElement('div');
    wrap.className = 'wrap';
    wrap.appendChild(bar);
    main.insertBefore(wrap, main.firstChild);

    document.getElementById('inappCopy').addEventListener('click', function () {
      var btn = this;
      copyText(location.href).then(function () { btn.textContent = '✅ 복사됨'; }, function () { btn.textContent = '복사 실패'; })
        .then(function () { setTimeout(function () { btn.textContent = '주소 복사'; }, 1800); });
    });
    document.getElementById('inappClose').addEventListener('click', function () {
      wrap.remove();
      store(function (s) { s.setItem(DISMISS_KEY, '1'); });
    });
  }

  /* ---------- 길게 눌러 저장하는 이미지 화면 ---------- */
  function showImage(blob) {
    var url = URL.createObjectURL(blob);
    var layer = document.createElement('div');
    layer.className = 'img-sheet';
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-modal', 'true');
    layer.setAttribute('aria-label', '결과 카드 이미지');
    layer.innerHTML =
      '<div class="img-sheet-box">' +
      '<p><b>이미지를 길게 눌러 저장하세요</b><span>앱 안 브라우저에서는 저장 버튼이 막혀 있어 이렇게 저장해요.</span></p>' +
      '<img alt="단톡 리포트 결과 카드">' +
      '<button class="btn btn-primary" type="button">닫기</button>' +
      '</div>';
    layer.querySelector('img').src = url;
    function close() {
      layer.remove();
      document.removeEventListener('keydown', onKey);
      URL.revokeObjectURL(url);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    layer.querySelector('button').addEventListener('click', close);
    layer.addEventListener('click', function (e) { if (e.target === layer) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(layer);
    layer.querySelector('button').focus();
  }

  var info = detect();
  var api = {
    detect: detect,
    externalUrl: externalUrl,
    isInApp: function () { return info.inApp; },
    showImage: showImage,
    showBanner: showBanner
  };
  root.TalkInApp = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;

  if (typeof document !== 'undefined' && info.inApp) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { showBanner(info); });
    else showBanner(info);
  }
})(typeof window !== 'undefined' ? window : globalThis);
