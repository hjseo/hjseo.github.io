/*
 * 단톡 리포트 - 통계 계산
 */
(function (root) {
  'use strict';

  var P_PHOTO = /^사진(?: (\d+)장)?$/;
  var P_EMOTICON = /^\(?이모티콘\)?$/;
  var P_VIDEO = /^동영상$/;
  var P_FILE = /^파일: /;
  var P_DELETED = /삭제된 메시지입니다/;
  var P_LINK = /https?:\/\/\S+/;
  var P_URL_G = /https?:\/\/\S+/g;
  var P_JAMO = /^[ㄱ-ㅎㅏ-ㅣ]+$/;
  var P_NUM = /^[\d,.]+$/;
  var SPLIT = /[\s.,!?~^…"'“”‘’()\[\]{}<>:;\/\\|·ㆍ\-_=+*#@&%$♡♥★☆❤️]+/;
  var JOSA = /(이랑|에서|으로|한테|에게|까지|부터|처럼|보다|은|는|이|가|을|를|도|에|로|와|과|랑|의|만)$/;
  var STOP = new Set(('그리고 그래서 근데 그런데 그럼 그냥 이거 그거 저거 이건 그건 저건 이게 그게 저게 여기 거기 저기 ' +
    '나도 너도 우리 저희 제가 내가 니가 네가 너는 나는 이제 지금 아까 오늘 내일 어제 그래 그렇게 이렇게 저렇게 ' +
    '하고 해서 하는 했어 했는데 하면 해도 있어 있는 없어 없는 같아 같은 되는 되면 돼서 ' +
    '아니 아니야 응응 어어 오오 헐헐 이모티콘 사진 동영상 삭제된 메시지입니다 파일').split(' '));

  var DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dateKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function monthKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1); }

  function countChar(str, ch) {
    var n = 0;
    for (var i = 0; i < str.length; i++) if (str[i] === ch) n++;
    return n;
  }

  function normWord(w) {
    if (w.length > 2) {
      var s = w.replace(JOSA, '');
      if (s.length >= 2) w = s;
    }
    return w;
  }

  /**
   * @param {Array<{t:number,s:string,x:string}>} all
   * @param {{since?: number}} [opts]
   */
  function analyze(all, opts) {
    opts = opts || {};
    var msgs = opts.since ? all.filter(function (m) { return m.t >= opts.since; }) : all;

    var people = new Map();
    var hours = new Array(24).fill(0);
    var weekdays = new Array(7).fill(0);
    var heat = []; for (var i = 0; i < 7; i++) heat.push(new Array(24).fill(0));
    var months = new Map();
    var days = new Map();
    var words = new Map();
    var media = { photo: 0, emoticon: 0, video: 0, file: 0, link: 0, deleted: 0, laugh: 0 };
    var prevT = 0;
    var GAP = 60 * 60 * 1000;

    for (var k = 0; k < msgs.length; k++) {
      var m = msgs[k];
      var d = new Date(m.t);
      var h = d.getHours(), wd = d.getDay();
      var p = people.get(m.s);
      if (!p) {
        p = { name: m.s, count: 0, textCount: 0, chars: 0, laugh: 0, photo: 0, emoticon: 0, video: 0,
              file: 0, link: 0, deleted: 0, night: 0, morning: 0, starts: 0, first: m.t, last: m.t };
        people.set(m.s, p);
      }
      p.count++; p.last = m.t;
      hours[h]++; weekdays[wd]++; heat[wd][h]++;
      var mk = monthKey(d); months.set(mk, (months.get(mk) || 0) + 1);
      var dk = dateKey(d); days.set(dk, (days.get(dk) || 0) + 1);
      if (h < 5) p.night++;
      else if (h < 9) p.morning++;
      if (k > 0 && m.t - prevT >= GAP) p.starts++;
      prevT = m.t;

      var x = m.x.trim(), pm;
      if ((pm = P_PHOTO.exec(x))) { var n = pm[1] ? +pm[1] : 1; p.photo += n; media.photo += n; continue; }
      if (P_EMOTICON.test(x)) { p.emoticon++; media.emoticon++; continue; }
      if (P_VIDEO.test(x)) { p.video++; media.video++; continue; }
      if (P_FILE.test(x)) { p.file++; media.file++; continue; }
      if (P_DELETED.test(x)) { p.deleted++; media.deleted++; continue; }
      if (P_LINK.test(x)) { p.link++; media.link++; }

      var lg = countChar(x, 'ㅋ');
      p.laugh += lg; media.laugh += lg;
      p.textCount++; p.chars += x.length;

      var toks = x.replace(P_URL_G, ' ').split(SPLIT);
      for (var t = 0; t < toks.length; t++) {
        var w = toks[t];
        if (w.length < 2 || w.length > 15 || P_JAMO.test(w) || P_NUM.test(w)) continue;
        w = normWord(w.toLowerCase());
        if (w.length < 2 || STOP.has(w)) continue;
        words.set(w, (words.get(w) || 0) + 1);
      }
    }

    var list = Array.from(people.values());
    list.forEach(function (p) {
      p.avgLen = p.textCount ? p.chars / p.textCount : 0;
      p.share = msgs.length ? p.count / msgs.length : 0;
    });
    list.sort(function (a, b) { return b.count - a.count; });

    var start = msgs.length ? msgs[0].t : 0;
    var end = msgs.length ? msgs[msgs.length - 1].t : 0;
    var spanDays = msgs.length ? Math.max(1, Math.round((end - start) / 86400000) + 1) : 0;

    var monthList = [];
    if (msgs.length) {
      var c = new Date(start); c.setDate(1);
      var e = new Date(end);
      while (c.getFullYear() < e.getFullYear() || (c.getFullYear() === e.getFullYear() && c.getMonth() <= e.getMonth())) {
        var key = monthKey(c);
        monthList.push({ key: key, count: months.get(key) || 0 });
        c.setMonth(c.getMonth() + 1);
      }
    }

    var hotDays = Array.from(days.entries()).sort(function (a, b) { return b[1] - a[1]; })
      .slice(0, 5).map(function (e) { return { date: e[0], count: e[1] }; });

    var topWords = Array.from(words.entries()).sort(function (a, b) { return b[1] - a[1]; })
      .slice(0, 30).map(function (e) { return { word: e[0], count: e[1] }; });

    var peakHour = hours.indexOf(Math.max.apply(null, hours));
    var peakDay = weekdays.indexOf(Math.max.apply(null, weekdays));

    return {
      total: msgs.length,
      start: start, end: end, days: spanDays,
      activeDays: days.size,
      perDay: spanDays ? msgs.length / spanDays : 0,
      people: list,
      hours: hours, weekdays: weekdays, heat: heat,
      months: monthList, hotDays: hotDays, words: topWords,
      media: media, peakHour: peakHour, peakDay: peakDay,
      awards: awards(list)
    };
  }

  function best(list, key, minFn) {
    var top = null;
    list.forEach(function (p) {
      if (minFn && !minFn(p)) return;
      if (p[key] > 0 && (!top || p[key] > top[key])) top = p;
    });
    return top;
  }

  function fmt(n) { return Math.round(n).toLocaleString('ko-KR'); }

  function awards(list) {
    var out = [];
    function add(icon, title, p, desc) { if (p) out.push({ icon: icon, title: title, name: p.name, desc: desc }); }
    var maxText = list.reduce(function (a, p) { return Math.max(a, p.textCount); }, 0);
    var minText = Math.max(10, maxText * 0.05);

    var p;
    p = best(list, 'count'); add('👑', '수다왕', p, p && '메시지 ' + fmt(p.count) + '개');
    p = best(list, 'laugh'); add('🤣', '웃음 장인', p, p && 'ㅋ를 ' + fmt(p.laugh) + '번 입력');
    p = best(list, 'starts'); add('🔔', '대화 시작 요정', p, p && '1시간 넘는 정적을 ' + fmt(p.starts) + '번 깸');
    p = best(list, 'night'); add('🦉', '새벽 올빼미', p, p && '새벽 0~5시에 ' + fmt(p.night) + '개');
    p = best(list, 'morning'); add('🌅', '아침형 인간', p, p && '아침 5~9시에 ' + fmt(p.morning) + '개');
    p = best(list, 'avgLen', function (q) { return q.textCount >= minText; });
    add('📜', '장문러', p, p && '평균 ' + p.avgLen.toFixed(1) + '자');
    p = best(list, 'photo'); add('📸', '사진 담당', p, p && '사진 ' + fmt(p.photo) + '장');
    p = best(list, 'emoticon'); add('🧸', '이모티콘 부자', p, p && '이모티콘 ' + fmt(p.emoticon) + '개');
    p = best(list, 'link'); add('🔗', '링크 배달부', p, p && '링크 ' + fmt(p.link) + '개');
    p = best(list, 'deleted'); add('🫣', '앗 실수', p, p && '삭제한 메시지 ' + fmt(p.deleted) + '개');
    return out;
  }

  var api = { analyze: analyze, DAY_NAMES: DAY_NAMES };
  root.TalkStats = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
