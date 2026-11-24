/*
 * 단톡 리포트 - 대화 내보내기 파일 파서
 * 모든 처리는 브라우저 안에서만 이루어지며, 어떤 데이터도 외부로 전송하지 않습니다.
 *
 * 지원 형식
 *  - PC(Windows)  : "--------------- 2024년 1월 15일 월요일 ---------------" + "[이름] [오후 3:15] 내용"
 *  - Android(한글) : "2024년 1월 15일 오후 3:15, 이름 : 내용"
 *  - iPhone(한글)  : "2024. 1. 15. 오후 3:15, 이름 : 내용"
 *  - 24시간 / 대시 : "2024-01-15 15:15, 이름 : 내용"
 *  - 영문 Android  : "January 15, 2024, 3:15 PM, 이름 : 내용"  (근사 지원)
 *  - Mac CSV      : Date,User,Message
 */
(function (root) {
  'use strict';

  var MONTHS_EN = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

  var P_PC_DATE = /^-{3,}\s*(\d{4})년 (\d{1,2})월 (\d{1,2})일.*?-{3,}\s*$/;
  var P_PC_MSG = /^\[(.+?)\] \[(?:(오전|오후|AM|PM) ?)?(\d{1,2}):(\d{2})\] ?(.*)$/;
  var P_KO = /^(\d{4})년 (\d{1,2})월 (\d{1,2})일 (?:(오전|오후) ?)?(\d{1,2}):(\d{2}),?\s*(.*)$/;
  var P_DOT = /^(\d{4})\. ?(\d{1,2})\. ?(\d{1,2})\.? (?:(오전|오후) ?)?(\d{1,2}):(\d{2}),?\s*(.*)$/;
  var P_DASH = /^(\d{4})-(\d{1,2})-(\d{1,2}),? (?:(오전|오후) ?)?(\d{1,2}):(\d{2})(?::\d{2})?,?\s*(.*)$/;
  var P_EN = /^([A-Za-z]{3,9})\.? (\d{1,2}), (\d{4}),? (?:at )?(\d{1,2}):(\d{2})\s?(AM|PM|am|pm)?,?\s*(.*)$/;
  var P_DAY_LINE = /^\d{4}년 \d{1,2}월 \d{1,2}일 [월화수목금토일]요일\s*$/;
  var P_HEADER = /님과 카카오톡 대화\s*$|^저장한 날짜\s*:|^Date Saved\s*:|^Talk_\d/;
  var SYSTEM_RE = /(님이 들어왔습니다|님이 나갔습니다|님을 초대했습니다|님을 초대하였습니다|님을 내보냈습니다|초대했습니다\.\s*$|채팅방 관리자가|님이 방장|메시지가 가려졌습니다|운영정책을 위반한 메시지)/;

  function to24(ampm, h) {
    h = +h;
    if (ampm === '오후' || ampm === 'PM' || ampm === 'pm') { if (h < 12) h += 12; }
    else if (ampm === '오전' || ampm === 'AM' || ampm === 'am') { if (h === 12) h = 0; }
    return h;
  }

  function makeMsg(y, mo, d, h, mi, sender, text) {
    var date = new Date(+y, +mo - 1, +d, +h, +mi);
    return { t: date.getTime(), s: sender.trim(), x: text };
  }

  /** "이름 : 내용" 분리. 없으면 시스템 메시지 → null */
  function splitSender(rest) {
    var idx = rest.indexOf(' : ');
    if (idx <= 0) return null;
    return { s: rest.slice(0, idx), x: rest.slice(idx + 3) };
  }

  function parseCSV(text) {
    var rows = [], row = [], field = '', inQ = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQ) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false;
        } else field += c;
      } else if (c === '"') inQ = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field); rows.push(row); row = []; field = '';
      } else field += c;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  function parseMacCSV(text) {
    var rows = parseCSV(text), msgs = [];
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (r.length < 3) continue;
      var m = /^(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{2})/.exec(r[0]);
      if (!m || !r[1]) continue;
      msgs.push(makeMsg(m[1], m[2], m[3], m[4], m[5], r[1], r.slice(2).join(',')));
    }
    return msgs;
  }

  function detectRoomName(lines) {
    for (var i = 0; i < Math.min(lines.length, 5); i++) {
      var m = /^(.+?) 님과 카카오톡 대화\s*$/.exec(lines[i]);
      if (m) return m[1].trim();
    }
    return '';
  }

  /**
   * @param {string} text 파일 전체 텍스트
   * @returns {{messages: Array<{t:number,s:string,x:string}>, roomName: string, format: string}}
   */
  function parse(text) {
    text = text.replace(/^﻿/, '');
    if (/^"?Date"?,"?User"?,"?Message"?/.test(text)) {
      return { messages: parseMacCSV(text), roomName: '', format: 'mac-csv' };
    }

    var lines = text.split(/\r?\n/);
    var msgs = [];
    var cur = null;          // PC 형식 현재 날짜 [y, m, d]
    var last = null;         // 여러 줄 메시지를 이어 붙일 대상
    var counts = { pc: 0, ko: 0, dot: 0, dash: 0, en: 0 };
    var m, sp;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!line) continue;

      if ((m = P_PC_DATE.exec(line))) { cur = [m[1], m[2], m[3]]; last = null; continue; }

      if (cur && (m = P_PC_MSG.exec(line))) {
        last = makeMsg(cur[0], cur[1], cur[2], to24(m[2], m[3]), m[4], m[1], m[5]);
        msgs.push(last); counts.pc++; continue;
      }

      if ((m = P_KO.exec(line)) || (m = P_DOT.exec(line)) || (m = P_DASH.exec(line))) {
        sp = splitSender(m[7]);
        if (sp) {
          last = makeMsg(m[1], m[2], m[3], to24(m[4], m[5]), m[6], sp.s, sp.x);
          msgs.push(last);
          counts[P_KO.test(line) ? 'ko' : P_DOT.test(line) ? 'dot' : 'dash']++;
        } else last = null;
        continue;
      }

      if ((m = P_EN.exec(line)) && MONTHS_EN[m[1].slice(0, 3).toLowerCase()]) {
        sp = splitSender(m[7]);
        if (sp) {
          last = makeMsg(m[3], MONTHS_EN[m[1].slice(0, 3).toLowerCase()], m[2], to24(m[6], m[4]), m[5], sp.s, sp.x);
          msgs.push(last); counts.en++;
        } else last = null;
        continue;
      }

      if (P_DAY_LINE.test(line) || P_HEADER.test(line)) { last = null; continue; }
      if (SYSTEM_RE.test(line)) { last = null; continue; }

      if (last) last.x += '\n' + line;   // 여러 줄 메시지
    }

    var format = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
    msgs.sort(function (a, b) { return a.t - b.t; });
    return { messages: msgs, roomName: detectRoomName(lines), format: msgs.length ? format : 'unknown' };
  }

  /** ArrayBuffer → 문자열 (UTF-8 우선, 실패 시 EUC-KR) */
  function decode(buffer) {
    try { return new TextDecoder('utf-8', { fatal: true }).decode(buffer); }
    catch (e) {
      try { return new TextDecoder('euc-kr').decode(buffer); }
      catch (e2) { return new TextDecoder('utf-8').decode(buffer); }
    }
  }

  var api = { parse: parse, decode: decode };
  root.TalkParser = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
