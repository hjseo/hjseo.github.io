/*
 * 단톡 리포트 - 화면 제어
 * 업로드한 파일은 이 브라우저 안에서만 읽습니다. 네트워크 전송 코드는 없습니다.
 * 두 페이지에서 함께 씁니다.
 *  - index.html : 파일 업로드 → 분석 → 결과
 *  - r.html     : 공유 링크(# 뒤의 요약)로 결과만 보기
 */
(function () {
  'use strict';

  var IS_SHARED = document.body.getAttribute('data-page') === 'shared';
  var SITE_URL = location.origin && location.origin !== 'null' ? location.origin.replace(/^https?:\/\//, '') : '단톡 리포트';
  var DAY = ['일', '월', '화', '수', '목', '금', '토'];
  var $ = function (id) { return document.getElementById(id); };

  var state = { messages: [], roomName: '', analysis: null, mask: false, months: 0, showAll: false };

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmt(n) { return Math.round(n).toLocaleString('ko-KR'); }
  function maskName(name) {
    if (!state.mask) return name;
    var chars = Array.from(name);
    if (chars.length <= 1) return '*';
    if (chars.length === 2) return chars[0] + '*';
    return chars[0] + '*'.repeat(chars.length - 2) + chars[chars.length - 1];
  }
  function nm(name) { return esc(maskName(name)); }
  function ymd(t) {
    var d = new Date(t);
    return d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
  }
  function dayLabel(key) {
    var p = key.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
    return p[0] + '년 ' + (+p[1]) + '월 ' + (+p[2]) + '일 (' + DAY[d.getDay()] + ')';
  }
  function hourLabel(h) { return (h < 12 ? '오전 ' : '오후 ') + (h % 12 === 0 ? 12 : h % 12) + '시'; }
  function setHTML(id, html) { var el = $(id); if (el) el.innerHTML = html; }
  function setText(id, text) { var el = $(id); if (el) el.textContent = text; }

  /** 결과 카드와 링크에 쓸 방 이름 */
  function displayRoom() {
    if (IS_SHARED) return state.roomName || '우리 단톡방';
    var input = $('roomInput');
    var room = (input && input.value.trim()) || '우리 단톡방';
    if (state.mask && room === state.roomName) room = '우리 단톡방';
    return room;
  }

  /* ---------- file handling (index.html) ---------- */
  function showError(msg) {
    var el = $('error');
    el.innerHTML = msg;
    el.hidden = false;
  }

  function loadText(text, isDemo) {
    $('error').hidden = true;
    $('loading').hidden = false;
    $('result').hidden = true;
    setTimeout(function () {
      var parsed;
      try { parsed = TalkParser.parse(text); }
      catch (e) { parsed = { messages: [] }; }
      $('loading').hidden = true;
      if (!parsed.messages.length) {
        showError('<b>대화를 찾지 못했어요.</b><br>메신저에서 ‘대화 내보내기’로 받은 .txt(또는 Mac의 .csv) 파일인지 확인해 주세요. ' +
          '사진까지 포함된 .zip 파일이라면 압축을 풀고 안의 .txt 파일을 올려 주세요. <a href="#guide">내보내는 방법 보기</a>');
        return;
      }
      state.messages = parsed.messages;
      state.roomName = isDemo ? '우리끼리 여행 계획방 (예시)' : (parsed.roomName || '');
      state.months = 0; state.showAll = false;
      $('period').value = '0';
      $('roomInput').value = state.roomName;
      run();
      $('result').hidden = false;
      $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 30);
  }

  function readFile(file) {
    if (!file) return;
    if (/\.zip$/i.test(file.name)) {
      showError('<b>.zip 파일이에요.</b> 압축을 풀고 안에 있는 .txt 파일을 올려 주세요.');
      return;
    }
    if (file.size > 300 * 1024 * 1024) {
      showError('<b>파일이 너무 커요(300MB 초과).</b> 기간을 나눠 내보내거나 PC에서 시도해 주세요.');
      return;
    }
    file.arrayBuffer().then(function (buf) { loadText(TalkParser.decode(buf), false); })
      .catch(function () { showError('파일을 읽지 못했어요. 다시 시도해 주세요.'); });
  }

  function run() {
    var since = 0;
    if (state.months && state.messages.length) {
      var last = new Date(state.messages[state.messages.length - 1].t);
      last.setMonth(last.getMonth() - state.months);
      since = last.getTime();
    }
    state.analysis = TalkStats.analyze(state.messages, { since: since });
    render();
  }

  /* ---------- render (both pages) ---------- */
  function render() {
    var a = state.analysis;
    setText('roomLabel', IS_SHARED ? displayRoom() : (state.mask ? '우리 단톡방' : (state.roomName || '우리 단톡방')));
    renderStats(a);
    renderAwards(a);
    renderRanking(a);
    renderHours(a);
    renderWeekdays(a);
    renderHeat(a);
    renderMonths(a);
    renderHotDays(a);
    renderWords(a);
    renderTable(a);
    renderCard(a);
    renderLinkNote();
  }

  function renderStats(a) {
    var top = a.people[0];
    var count = a.peopleCount != null ? a.peopleCount : a.people.length;
    var tiles = [
      ['총 메시지', fmt(a.total) + '개', ymd(a.start) + ' ~ ' + ymd(a.end)],
      ['대화 기간', fmt(a.days) + '일', '대화한 날 ' + fmt(a.activeDays) + '일'],
      ['하루 평균', fmt(a.perDay) + '개', '참여 인원 ' + count + '명'],
      ['가장 활발한 때', DAY[a.peakDay] + '요일 ' + a.peakHour + '시', top ? '수다왕 ' + maskName(top.name) : '']
    ];
    setHTML('stats', tiles.map(function (t) {
      return '<div class="stat reveal"><div class="stat-label">' + t[0] + '</div><div class="stat-value">' + esc(t[1]) +
        '</div><div class="stat-note">' + esc(t[2]) + '</div></div>';
    }).join(''));
  }

  function renderAwards(a) {
    setHTML('awards', a.awards.map(function (w) {
      return '<div class="award"><div class="award-icon" aria-hidden="true">' + esc(w.icon) + '</div><div><div class="award-title">' + esc(w.title) +
        '</div><div class="award-name">' + nm(w.name) + '</div><div class="award-desc">' + esc(w.desc) + '</div></div></div>';
    }).join('') || '<p class="sub">칭호를 정할 만큼 대화가 많지 않아요.</p>');
  }

  function renderRanking(a) {
    var LIMIT = 10;
    var list = state.showAll ? a.people : a.people.slice(0, LIMIT);
    var max = a.people.length ? a.people[0].count || 1 : 1;
    setHTML('ranking', list.map(function (p, i) {
      var tip = maskName(p.name) + '\n메시지 ' + fmt(p.count) + '개 (' + (p.share * 100).toFixed(1) + '%)\nㅋ ' + fmt(p.laugh) +
        '번 · 사진 ' + fmt(p.photo) + '장 · 이모티콘 ' + fmt(p.emoticon) + '개\n평균 ' + p.avgLen.toFixed(1) + '자';
      return '<div class="hbar" data-tip="' + esc(tip) + '"><span class="hbar-name">' + (i + 1) + '. ' + nm(p.name) + '</span>' +
        '<div class="hbar-track"><div class="hbar-fill" style="width:' + (p.count / max * 100).toFixed(2) + '%"></div></div>' +
        '<span class="hbar-val">' + fmt(p.count) + ' · ' + (p.share * 100).toFixed(0) + '%</span></div>';
    }).join(''));
    var btn = $('moreBtn');
    if (btn) {
      btn.hidden = a.people.length <= LIMIT;
      btn.textContent = state.showAll ? '접기' : '전체 ' + a.people.length + '명 보기';
    }
  }

  /** 단일 계열 세로 막대 차트 */
  function vbars(values, labels, tips) {
    var max = Math.max.apply(null, values) || 1;
    var peak = values.indexOf(max);
    var bars = values.map(function (v, i) {
      var label = i === peak && v > 0 ? '<span class="vbar-peak" style="bottom:calc(' + (v / max * 100).toFixed(2) + '% + 4px)">' + esc(fmt(v)) + '</span>' : '';
      return '<div class="vbar" data-tip="' + esc(tips[i]) + '">' + label +
        '<div class="vbar-fill" style="height:' + (v / max * 100).toFixed(2) + '%"></div></div>';
    }).join('');
    var axis = labels.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('');
    return '<div class="vbars" role="img">' + bars + '</div><div class="vaxis">' + axis + '</div>';
  }

  function renderHours(a) {
    var labels = a.hours.map(function (_, h) { return h % 3 === 0 ? String(h) : ''; });
    var tips = a.hours.map(function (v, h) { return h + '시~' + (h + 1) + '시\n' + fmt(v) + '개'; });
    setHTML('hours', vbars(a.hours, labels, tips));
    setText('hourSub', '가장 활발한 시간: ' + hourLabel(a.peakHour) + ' (' + fmt(a.hours[a.peakHour]) + '개)');
  }

  function renderWeekdays(a) {
    var order = [1, 2, 3, 4, 5, 6, 0];   // 월요일부터
    var vals = order.map(function (d) { return a.weekdays[d]; });
    var tips = order.map(function (d) { return DAY[d] + '요일\n' + fmt(a.weekdays[d]) + '개'; });
    setHTML('weekdays', vbars(vals, order.map(function (d) { return DAY[d]; }), tips));
    setText('daySub', '가장 수다스러운 요일: ' + DAY[a.peakDay] + '요일');
  }

  function renderHeat(a) {
    var max = 1;
    a.heat.forEach(function (row) { row.forEach(function (v) { if (v > max) max = v; }); });
    var order = [1, 2, 3, 4, 5, 6, 0];
    var html = '<div class="heat" role="img" aria-label="요일과 시간대별 메시지 수"><span></span>';
    for (var h = 0; h < 24; h++) html += '<span class="lab">' + (h % 6 === 0 ? h : '') + '</span>';
    order.forEach(function (d) {
      html += '<span class="lab">' + DAY[d] + '</span>';
      for (var h2 = 0; h2 < 24; h2++) {
        var v = a.heat[d][h2];
        var style = v ? ' style="background:rgba(var(--bar-rgb),' + (0.1 + 0.9 * Math.sqrt(v / max)).toFixed(3) + ')"' : '';
        html += '<span class="cell"' + style + ' data-tip="' + DAY[d] + '요일 ' + h2 + '시\n' + fmt(v) + '개"></span>';
      }
    });
    setHTML('heat', html + '</div>');
  }

  function renderMonths(a) {
    var ms = a.months;
    var step = Math.ceil(ms.length / 12) || 1;
    var labels = ms.map(function (m, i) {
      if (i % step) return '';
      var p = m.key.split('-');
      return (i === 0 || p[1] === '01' ? p[0].slice(2) + '.' : '') + (+p[1]) + '월';
    });
    var tips = ms.map(function (m) { var p = m.key.split('-'); return p[0] + '년 ' + (+p[1]) + '월\n' + fmt(m.count) + '개'; });
    setHTML('months', vbars(ms.map(function (m) { return m.count; }), labels, tips));
    var best = ms.reduce(function (b, m) { return !b || m.count > b.count ? m : b; }, null);
    setText('monthSub', best ? '가장 활발했던 달: ' + best.key.split('-')[0] + '년 ' + (+best.key.split('-')[1]) + '월' : '');
  }

  function renderHotDays(a) {
    setHTML('hotDays', a.hotDays.map(function (d, i) {
      return '<li><span>' + ['🥇', '🥈', '🥉', '4위', '5위'][i] + ' ' + esc(dayLabel(d.date)) + '</span><b>' + fmt(d.count) + '개</b></li>';
    }).join(''));
  }

  function renderWords(a) {
    setHTML('words', a.words.slice(0, 24).map(function (w) {
      return '<span class="word">' + esc(w.word) + '<small>' + fmt(w.count) + '</small></span>';
    }).join('') || '<p class="sub">단어가 충분하지 않아요.</p>');
  }

  function renderTable(a) {
    if (!$('table')) return;
    var head = '<thead><tr><th>이름</th><th>메시지</th><th>비율</th><th>평균 글자</th><th>ㅋ</th><th>사진</th><th>이모티콘</th><th>링크</th><th>새벽</th><th>대화 시작</th></tr></thead>';
    var body = a.people.map(function (p) {
      return '<tr><td>' + nm(p.name) + '</td><td>' + fmt(p.count) + '</td><td>' + (p.share * 100).toFixed(1) + '%</td><td>' + p.avgLen.toFixed(1) +
        '</td><td>' + fmt(p.laugh) + '</td><td>' + fmt(p.photo) + '</td><td>' + fmt(p.emoticon) + '</td><td>' + fmt(p.link) +
        '</td><td>' + fmt(p.night) + '</td><td>' + fmt(p.starts) + '</td></tr>';
    }).join('');
    $('table').innerHTML = head + '<tbody>' + body + '</tbody>';
  }

  function renderCard(a) {
    var medals = ['🥇', '🥈', '🥉'];
    var rank = a.people.slice(0, 3).map(function (p, i) {
      return '<div><span class="medal">' + medals[i] + '</span><b>' + nm(p.name) + '</b><span class="n">' + fmt(p.count) + '개 · ' + (p.share * 100).toFixed(0) + '%</span></div>';
    }).join('');
    var aw = a.awards.filter(function (w) { return w.title !== '수다왕'; }).slice(0, 4).map(function (w) {
      return '<div>' + esc(w.icon) + ' ' + esc(w.title) + '<b>' + nm(w.name) + '</b></div>';
    }).join('');
    var words = a.words.slice(0, 6).map(function (w) { return '<span>' + esc(w.word) + '</span>'; }).join('');
    setHTML('shareCard',
      '<span class="sc-tag">단톡 리포트</span>' +
      '<div class="sc-title">' + esc(displayRoom()) + '</div>' +
      '<div class="sc-period">' + ymd(a.start) + ' ~ ' + ymd(a.end) + ' · ' + fmt(a.days) + '일</div>' +
      '<div class="sc-big"><div><small>총 메시지</small><b>' + fmt(a.total) + '</b></div><div><small>최고 활발 시간</small><b>' +
      DAY[a.peakDay] + ' ' + a.peakHour + '시</b></div></div>' +
      '<div class="sc-h">💬 수다왕 TOP 3</div><div class="sc-rank">' + rank + '</div>' +
      (aw ? '<div class="sc-h">🏆 칭호</div><div class="sc-awards">' + aw + '</div>' : '') +
      (words ? '<div class="sc-h">🗣️ 많이 쓴 단어</div><div class="sc-words">' + words + '</div>' : '') +
      '<div class="sc-foot"><span>대화 파일은 서버에 저장하지 않아요</span><span>' + esc(SITE_URL) + '</span></div>');
    prepareCard();
  }

  function renderLinkNote() {
    var el = $('linkNote');
    if (!el || IS_SHARED) return;
    el.innerHTML = state.mask
      ? '🔒 이름을 가린 결과로 링크가 만들어져요. 원본 대화 내용은 링크에 담기지 않아요.'
      : '⚠️ 링크를 받은 사람은 누구나 <b>이름이 보이는 결과</b>를 볼 수 있어요. 가리려면 위에서 ‘이름 가리기’를 켜세요.';
  }

  /* ---------- 결과 링크 ---------- */
  var linkCache = { key: '', url: '' };

  /** 현재 결과를 담은 공유 링크 (공유 페이지에서는 지금 주소 그대로) */
  function resultLink() {
    if (IS_SHARED) return Promise.resolve(location.href);
    var a = state.analysis;
    var payload = TalkShare.toPayload(a, maskName, displayRoom());
    var cacheKey = JSON.stringify(payload);
    if (cacheKey === linkCache.key) return Promise.resolve(linkCache.url);
    return TalkShare.encode(payload).then(function (data) {
      var url = new URL('r.html', location.href.split('#')[0]).href + '#' + data;
      linkCache = { key: cacheKey, url: url };
      return url;
    });
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

  function copyLink() {
    var btn = $('copyBtn'), label = btn.textContent;
    resultLink().then(copyText).then(function () {
      btn.textContent = '✅ 링크가 복사됐어요';
    }, function () {
      btn.textContent = '복사하지 못했어요';
    }).then(function () { setTimeout(function () { btn.textContent = label; }, 2000); });
  }

  /* ---------- image export ----------
   * 웹페이지는 저장 위치(파일/사진)를 직접 고를 수 없어서, 기기마다 사진에 저장되는 방법을 씁니다.
   *  - 아이폰: 공유 창을 열고 '이미지 저장'을 누르면 사진 앱에 저장됨
   *  - 공유 창을 못 여는 아이폰·앱 안 브라우저: 이미지를 띄워 길게 눌러 '사진에 저장'
   *  - 안드로이드·PC: 다운로드 (안드로이드는 갤러리 앱의 'Download' 앨범에 보임)
   */
  var UA = navigator.userAgent;
  var IS_IOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var IS_ANDROID = /Android/i.test(UA);
  var SAVE_LABEL = '🖼️ 이미지 저장';

  function canShareFiles() {
    try { return !!(navigator.canShare && navigator.canShare({ files: [new File([''], 'a.png', { type: 'image/png' })] })); }
    catch (e) { return false; }
  }
  function inApp() { return !!(window.TalkInApp && TalkInApp.isInApp()); }

  var cache = { html: '', promise: null, blob: null };
  /** 결과 카드 이미지. 카드 내용이 그대로면 만들어 둔 이미지를 다시 씁니다. */
  function cardBlob() {
    if (!window.html2canvas) return Promise.reject(new Error('html2canvas'));
    var html = $('shareCard').innerHTML;
    if (cache.promise && cache.html === html) return cache.promise;
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    var p = ready.then(function () {
      return html2canvas($('shareCard'), { scale: 3, backgroundColor: null, useCORS: true, logging: false });
    }).then(function (canvas) {
      return new Promise(function (res, rej) { canvas.toBlob(function (b) { b ? res(b) : rej(new Error('blob')); }, 'image/png'); });
    });
    cache = { html: html, promise: p, blob: null };
    p.then(function (b) { if (cache.promise === p) cache.blob = b; },
           function () { if (cache.promise === p) cache = { html: '', promise: null, blob: null }; });
    return p;
  }

  // 아이폰은 버튼을 누른 "바로 그 순간"에만 공유 창을 열어 줍니다.
  // 그래서 결과 카드가 바뀌면 이미지를 미리 만들어 두었다가, 누르자마자 공유 창을 엽니다.
  var prepTimer = null;
  function prepareCard() {
    if (!(IS_IOS && canShareFiles())) return;
    clearTimeout(prepTimer);
    prepTimer = setTimeout(function () { cardBlob().catch(function () { /* 누를 때 다시 시도 */ }); }, 700);
  }

  function fileOf(blob) { return new File([blob], '단톡리포트.png', { type: 'image/png' }); }
  function showSheet(blob) { if (window.TalkInApp) TalkInApp.showImage(blob); }
  function download(blob) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url; link.download = '단톡리포트.png';
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function flash(text) {
    var btn = $('saveBtn');
    btn.disabled = false; btn.textContent = text;
    setTimeout(function () { btn.textContent = SAVE_LABEL; }, 2200);
  }
  /** 공유 창 → '이미지 저장'. 사용자가 닫은 경우가 아니면 길게 눌러 저장 화면으로 */
  function shareToPhotos(blob) {
    return navigator.share({ files: [fileOf(blob)] }).catch(function (e) {
      if (!e || e.name !== 'AbortError') showSheet(blob);
    });
  }

  function saveImage() {
    var btn = $('saveBtn');
    // 아이폰: 미리 만들어 둔 이미지가 있으면 바로 공유 창
    if (IS_IOS && canShareFiles() && cache.blob && cache.html === $('shareCard').innerHTML) {
      shareToPhotos(cache.blob);
      return;
    }
    btn.disabled = true; btn.textContent = '만드는 중…';
    cardBlob().then(function (blob) {
      if (IS_IOS && canShareFiles()) { flash(SAVE_LABEL); return shareToPhotos(blob); }
      if (IS_IOS || inApp()) { flash(SAVE_LABEL); showSheet(blob); return; }
      download(blob);
      flash(IS_ANDROID ? '✅ 저장했어요 · 갤러리 > Download' : '✅ 저장했어요');
    }).catch(function () {
      flash('이미지를 만들지 못했어요');
    });
  }

  /** 저장 버튼 아래 기기별 안내 */
  function renderSaveNote() {
    var actions = $('saveBtn') && $('saveBtn').parentNode;
    if (!actions || $('saveNote')) return;
    var text = '';
    if (IS_IOS && canShareFiles()) text = '📱 공유 창이 열리면 <b>‘이미지 저장’</b>을 눌러 주세요. 사진 앱에 저장돼요.';
    else if (IS_IOS || inApp()) text = '📱 이미지가 뜨면 <b>길게 눌러 사진에 저장</b>하세요.';
    else if (IS_ANDROID) text = '📱 저장한 이미지는 <b>갤러리 앱의 ‘Download’ 앨범</b>에서 볼 수 있어요.';
    if (!text) return;
    var p = document.createElement('p');
    p.className = 'link-note'; p.id = 'saveNote'; p.innerHTML = text;
    actions.parentNode.insertBefore(p, actions.nextSibling);
  }

  function shareImage() {
    Promise.all([cardBlob(), resultLink()]).then(function (r) {
      var file = new File([r[0]], '단톡리포트.png', { type: 'image/png' });
      return navigator.share({ files: [file], title: '우리 단톡방 리포트', text: '우리 단톡방 분석 결과 보기 ' + r[1] });
    }).catch(function () { /* 사용자가 취소 */ });
  }

  /* ---------- tooltip ---------- */
  var tip = $('tip'), tipTarget = null;
  function placeTip(x, y) {
    var r = tip.getBoundingClientRect();
    var left = Math.min(window.innerWidth - r.width - 8, Math.max(8, x + 14));
    var top = y - r.height - 12;
    if (top < 8) top = y + 18;
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
  }
  function showTip(el, x, y) {
    tipTarget = el;
    tip.textContent = el.getAttribute('data-tip');
    tip.hidden = false;
    placeTip(x, y);
  }
  document.addEventListener('pointerover', function (e) {
    var el = e.target.closest && e.target.closest('[data-tip]');
    if (el && e.pointerType === 'mouse') showTip(el, e.clientX, e.clientY);
  });
  document.addEventListener('pointermove', function (e) {
    if (!tip.hidden && e.pointerType === 'mouse') {
      var el = e.target.closest && e.target.closest('[data-tip]');
      if (!el) { tip.hidden = true; tipTarget = null; return; }
      if (el !== tipTarget) showTip(el, e.clientX, e.clientY); else placeTip(e.clientX, e.clientY);
    }
  });
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-tip]');
    if (el && el !== tipTarget) showTip(el, e.clientX, e.clientY);
    else { tip.hidden = true; tipTarget = null; }
  });
  window.addEventListener('scroll', function () { tip.hidden = true; tipTarget = null; }, { passive: true });

  /* ---------- common buttons ---------- */
  $('saveBtn').addEventListener('click', saveImage);
  $('shareBtn').addEventListener('click', shareImage);
  $('copyBtn').addEventListener('click', copyLink);
  renderSaveNote();
  try {
    var probe = new File([''], 'a.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [probe] })) $('shareBtn').hidden = false;
  } catch (e) { /* 미지원 브라우저 */ }

  /* ---------- r.html : 공유 링크로 열었을 때 ---------- */
  if (IS_SHARED) {
    var data = location.hash.slice(1);
    var fail = function () { $('loading').hidden = true; $('result').hidden = true; $('sharedError').hidden = false; };
    // 이미 열린 결과 페이지에서 다른 결과 링크를 열면 # 뒤만 바뀌어 새로고침되지 않으므로 다시 불러옵니다.
    window.addEventListener('hashchange', function () { location.reload(); });
    if (!data) { fail(); return; }
    TalkShare.decode(data).then(function (o) {
      state.analysis = TalkShare.fromPayload(o);
      state.roomName = state.analysis.roomName;
      render();
      $('loading').hidden = true;
      $('result').hidden = false;
    }).catch(fail);
    return;
  }

  /* ---------- index.html events ---------- */
  var drop = $('drop');
  $('file').addEventListener('change', function (e) { readFile(e.target.files[0]); e.target.value = ''; });
  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-over'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-over'); });
  });
  drop.addEventListener('drop', function (e) { readFile(e.dataTransfer.files[0]); });
  // 페이지 어디에 떨어뜨려도 브라우저가 파일을 열지 않도록
  window.addEventListener('dragover', function (e) { e.preventDefault(); });
  window.addEventListener('drop', function (e) { e.preventDefault(); if (e.target.closest && !e.target.closest('#drop')) readFile(e.dataTransfer.files[0]); });

  $('demoBtn').addEventListener('click', function () { loadText(TalkSample.generate(), true); });
  // 앱 안 브라우저에서 파일 선택 창이 안 열리는 경우에만 안내
  if (window.TalkInApp) TalkInApp.watchUpload(drop, $('file'));
  $('resetBtn').addEventListener('click', function () {
    state.messages = []; $('result').hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $('file').click();
  });
  $('period').addEventListener('change', function (e) { state.months = +e.target.value; run(); });
  $('mask').addEventListener('change', function (e) { state.mask = e.target.checked; render(); });
  $('moreBtn').addEventListener('click', function () { state.showAll = !state.showAll; renderRanking(state.analysis); });
  $('roomInput').addEventListener('input', function () { if (state.analysis) renderCard(state.analysis); });

  // 가이드 탭
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
      document.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== tab.getAttribute('data-tab'); });
    });
  });
  // 휴대폰이면 해당 탭을 먼저 보여주기
  var ua = navigator.userAgent;
  var guess = /iPhone|iPad/.test(ua) ? 'ios' : /Android/.test(ua) ? 'android' : null;
  if (guess) document.querySelector('.tab[data-tab="' + guess + '"]').click();
})();
