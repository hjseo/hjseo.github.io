/*
 * 단톡 리포트 - 라이트/다크 모드 전환
 *
 * - 처음에는 기기 설정(prefers-color-scheme)을 따릅니다.
 * - 헤더의 버튼을 누르면 라이트/다크를 직접 고를 수 있고, 그 선택은 이 브라우저에만 저장됩니다.
 * - 화면이 깜빡이지 않도록 <head>에서 defer 없이 불러옵니다.
 */
(function () {
  'use strict';

  var KEY = 'dantok-theme';
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function saved() {
    try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null; }
    catch (e) { return null; }
  }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* 저장 불가 환경 */ } }

  /** 지금 화면에 적용된 모드 */
  function current() {
    var v = root.getAttribute('data-theme');
    if (v === 'light' || v === 'dark') return v;
    return media && media.matches ? 'dark' : 'light';
  }

  // 페이지가 그려지기 전에 저장된 선택을 먼저 적용
  var first = saved();
  if (first) root.setAttribute('data-theme', first);

  var SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z"/></svg>';

  function paint(btn) {
    var dark = current() === 'dark';
    // 지금이 다크면 해(라이트로 가기), 라이트면 달(다크로 가기)
    btn.innerHTML = dark ? SUN : MOON;
    var label = dark ? '라이트 모드로 전환' : '다크 모드로 전환';
    btn.setAttribute('aria-label', label);
    btn.title = label;
  }

  function mount() {
    var bar = document.querySelector('.site-header .wrap');
    if (!bar || document.getElementById('themeToggle')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'themeToggle';
    btn.className = 'theme-toggle';
    paint(btn);
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      save(next);
      paint(btn);
    });
    bar.appendChild(btn);
    // 직접 고르지 않은 상태에서 기기 설정이 바뀌면 아이콘도 맞춰 바꾸기
    if (media) {
      var onChange = function () { if (!saved()) paint(btn); };
      if (media.addEventListener) media.addEventListener('change', onChange);
      else if (media.addListener) media.addListener(onChange);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
