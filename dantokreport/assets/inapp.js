/*
 * 단톡 리포트 - 앱 안 브라우저(인앱 브라우저) 대응
 *
 * 앱 안에서 열었다는 이유만으로 안내를 띄우지 않습니다. 실제로 안 되는 순간에만 안내합니다.
 *  1) 파일 선택: 업로드 상자를 눌렀는데 파일 선택 창이 열리지 않으면, 상자 아래에 안내를 보여줍니다.
 *  2) 이미지 저장: 다운로드가 막히는 환경에서는 이미지를 띄워 "길게 눌러 저장"하게 합니다. (app.js에서 호출)
 * 두 경우 모두, 가능한 앱에서는 "외부 브라우저로 열기" 버튼을 함께 보여줍니다.
 */
(function (root) {
  'use strict';

  // 앱 안 브라우저의 User-Agent 표시
  var IN_APP = /KAKAOTALK|NAVER\(inapp|Instagram|FBAN|FBAV|FB_IAB|\bLine\/|everytimeApp|DaumApps|BAND\/|; wv\)/i;
  var PICKER_WAIT = 1500;   // 파일 선택 창이 뜨기를 기다리는 시간(ms)

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

  var info = detect();

  /** 외부 브라우저 열기 / 주소 복사 버튼 묶음 */
  function actionsHTML() {
    var ext = externalUrl(info.kind, location.href);
    var how = info.kind === 'ios'
      ? '화면의 <b>⋯</b> 또는 <b>공유</b> 버튼에서 <b>Safari로 열기</b>를 고르세요.'
      : '화면의 <b>⋮</b> 메뉴에서 <b>다른 브라우저로 열기</b>를 고르거나 주소를 복사해 브라우저에 붙여 넣으세요.';
    return (ext ? '' : '<span class="inapp-how">' + how + '</span>') +
      '<span class="inapp-actions">' +
      (ext ? '<a class="btn btn-primary" href="' + ext.replace(/"/g, '&quot;') + '">외부 브라우저로 열기</a>' : '') +
      '<button class="btn" type="button" data-inapp-copy>주소 복사</button></span>';
  }
  function bindCopy(scope) {
    var btn = scope.querySelector('[data-inapp-copy]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      copyText(location.href).then(function () { btn.textContent = '✅ 복사됨'; }, function () { btn.textContent = '복사 실패'; })
        .then(function () { setTimeout(function () { btn.textContent = '주소 복사'; }, 1800); });
    });
  }

  /* ---------- 1) 파일 선택 창이 안 열릴 때만 안내 ---------- */
  function showUploadHelp(dropEl) {
    if (document.getElementById('inappHelp')) return;
    var box = document.createElement('div');
    box.className = 'inapp';
    box.id = 'inappHelp';
    box.setAttribute('role', 'alert');
    box.innerHTML =
      '<div class="inapp-text"><b>📱 파일 선택 창이 열리지 않나요?</b>' +
      '<span>이 앱 안에서는 파일 선택이 막혀 있을 수 있어요. Chrome이나 Safari에서 열면 바로 돼요.</span>' +
      actionsHTML() + '</div>' +
      '<button class="inapp-close" type="button" aria-label="안내 닫기">✕</button>';
    dropEl.parentNode.insertBefore(box, dropEl.nextSibling);
    bindCopy(box);
    box.querySelector('.inapp-close').addEventListener('click', function () { box.remove(); });
  }

  /**
   * 앱 안 브라우저에서 업로드 상자를 눌렀을 때 파일 선택 창이 정말 열리는지 지켜봅니다.
   * 창이 열리면 페이지가 잠시 가려지거나(blur·visibilitychange) 파일이 선택(change)됩니다.
   * 그런 신호가 없으면 "열리지 않았다"고 보고 안내를 보여줍니다.
   */
  function watchUpload(dropEl, input) {
    if (!info.inApp || !dropEl || !input) return;
    var timer = null;
    function opened() { clearTimeout(timer); timer = null; }
    window.addEventListener('blur', opened);
    document.addEventListener('visibilitychange', function () { if (document.hidden) opened(); });
    input.addEventListener('change', function () {
      opened();
      // 실제로는 열렸는데 안내가 먼저 떴던 경우 정리
      var help = document.getElementById('inappHelp');
      if (help) help.remove();
    });
    input.addEventListener('click', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { if (!document.hidden) showUploadHelp(dropEl); }, PICKER_WAIT);
    });
  }

  /* ---------- 2) 길게 눌러 저장하는 이미지 화면 ---------- */
  function showImage(blob) {
    var url = URL.createObjectURL(blob);
    var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var how = ios ? '이미지를 길게 누른 뒤 <b>‘사진 앱에 저장’</b>을 고르세요.' : '이미지를 길게 누른 뒤 <b>‘이미지 저장’</b>을 고르세요. 갤러리에 저장돼요.';
    var layer = document.createElement('div');
    layer.className = 'img-sheet';
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-modal', 'true');
    layer.setAttribute('aria-label', '결과 카드 이미지');
    layer.innerHTML =
      '<div class="img-sheet-box">' +
      '<p><b>이미지를 길게 눌러 저장하세요</b><span>' + how + '</span></p>' +
      '<img alt="단톡 리포트 결과 카드">' +
      (info.inApp ? '<p class="img-sheet-alt"><span>길게 눌러도 저장되지 않으면 외부 브라우저에서 열어 주세요.</span>' + actionsHTML() + '</p>' : '') +
      '<button class="btn btn-primary" type="button" data-close>닫기</button>' +
      '</div>';
    layer.querySelector('img').src = url;
    bindCopy(layer);
    function close() {
      layer.remove();
      document.removeEventListener('keydown', onKey);
      URL.revokeObjectURL(url);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    layer.querySelector('[data-close]').addEventListener('click', close);
    layer.addEventListener('click', function (e) { if (e.target === layer) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(layer);
    layer.querySelector('[data-close]').focus();
  }

  var api = {
    detect: detect,
    externalUrl: externalUrl,
    isInApp: function () { return info.inApp; },
    showImage: showImage,
    watchUpload: watchUpload,
    showUploadHelp: showUploadHelp,
    _setInfo: function (v) { info = v; }   // 테스트용
  };
  root.TalkInApp = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
