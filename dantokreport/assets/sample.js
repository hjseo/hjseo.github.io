/*
 * 단톡 리포트 - "예시로 먼저 보기"용 가상 대화 생성기
 * 등장인물과 대화는 모두 가상입니다.
 */
(function (root) {
  'use strict';

  var PEOPLE = [
    { name: '민지', w: 30, night: 0.25, laugh: 0.6, photo: 0.03, emo: 0.08 },
    { name: '도윤', w: 22, night: 0.05, laugh: 0.2, photo: 0.02, emo: 0.02, long: true },
    { name: '서연', w: 20, night: 0.1, laugh: 0.4, photo: 0.12, emo: 0.05 },
    { name: '지호', w: 15, night: 0.4, laugh: 0.3, photo: 0.02, emo: 0.15 },
    { name: '하늘', w: 8, night: 0.02, laugh: 0.1, photo: 0.01, emo: 0.01, morning: true }
  ];

  var LINES = [
    '오늘 저녁 뭐 먹지', '치킨 콜?', '나 오늘 야근이야', '주말에 뭐해', '그 영화 봤어?', '진짜 웃기다',
    '헐 대박', '아 배고파', '퇴근하고 싶다', '날씨 미쳤다', '이번 주 토요일 어때', '나 가능', '나도 좋아',
    '장소는 홍대 어때', '강남이 더 가깝지 않아?', '예약할게', '고마워', '늦을 것 같아 미안', '거의 다 왔어',
    '어디야?', '커피 마실 사람', '오늘 회사에서 웃긴 일 있었는데', '나중에 얘기해줄게', '여행 가고 싶다',
    '제주도 어때', '비행기표 찾아볼게', '숙소는 내가 알아볼게', '좋아 좋아', '진짜 오랜만이다', '보고 싶다',
    '생일 축하해', '선물 뭐 받고 싶어', '케이크 내가 살게', '노래방 가자', '오늘 운동했다', '다이어트 내일부터',
    '마라탕 먹을래', '떡볶이 최고', '아 졸려', '잘 자', '굿모닝', '출근 완료', '점심 뭐 먹었어', '회의 끝',
    '드라마 다음 화 언제 나와', '스포 금지', '게임 한 판?', '오늘은 패스', '내일 봐', '사진 보내줘'
  ];
  var LONG = [
    '내가 생각해봤는데 이번 여행은 금요일 저녁에 출발해서 일요일 오후에 돌아오는 게 제일 좋을 것 같아. 숙소는 바다 보이는 곳으로 잡고 렌트카는 내가 운전할게',
    '오늘 회사에서 있었던 일인데 팀장님이 갑자기 회의를 소집해서 다들 긴장했는데 알고 보니 간식 나눠주려고 부른 거였어',
    '정산은 내가 해볼게. 숙소비랑 렌트비 합쳐서 나누면 될 것 같고 기름값은 따로 계산하자'
  ];
  var LINKS = ['https://example.com/restaurant', 'https://example.com/hotel', 'https://example.com/movie'];

  function rng(seed) {
    return function () {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  }

  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /** PC(Windows) 내보내기 형식의 가상 대화 텍스트를 만든다 */
  function generate() {
    var r = rng(20261124);
    var out = ['우리끼리 여행 계획방 님과 카카오톡 대화', '저장한 날짜 : 2026-11-24 오후 9:00:00', ''];
    var day = new Date(2026, 4, 1);
    var end = new Date(2026, 10, 23);
    var totalW = PEOPLE.reduce(function (a, p) { return a + p.w; }, 0);
    var DAYS = ['일', '월', '화', '수', '목', '금', '토'];

    while (day <= end) {
      var wd = day.getDay();
      var busy = (wd === 5 || wd === 6) ? 1.6 : 1;
      if (day.getMonth() === 6) busy *= 1.8;              // 7월: 여행 준비로 활발
      var n = Math.floor(r() * 40 * busy);
      if (r() < 0.12) n = 0;
      if (n) {
        out.push('--------------- ' + day.getFullYear() + '년 ' + (day.getMonth() + 1) + '월 ' + day.getDate() + '일 ' + DAYS[wd] + '요일 ---------------');
        var times = [];
        for (var i = 0; i < n; i++) {
          var x = r();
          var h = x < 0.55 ? 18 + Math.floor(r() * 6) : x < 0.8 ? 11 + Math.floor(r() * 3) : x < 0.9 ? Math.floor(r() * 3) : 7 + Math.floor(r() * 2);
          times.push(h * 60 + Math.floor(r() * 60));
        }
        times.sort(function (a, b) { return a - b; });
        times.forEach(function (tm) {
          var h = Math.floor(tm / 60), mi = tm % 60;
          var acc = r() * totalW, p = PEOPLE[0];
          for (var j = 0; j < PEOPLE.length; j++) { acc -= PEOPLE[j].w; if (acc <= 0) { p = PEOPLE[j]; break; } }
          if (h < 5 && r() > p.night * 2) p = r() < 0.6 ? PEOPLE[3] : PEOPLE[0];
          if (h >= 7 && h < 9 && r() < 0.5) p = PEOPLE[4];
          var text;
          var y = r();
          if (y < p.photo) text = r() < 0.3 ? '사진 ' + (2 + Math.floor(r() * 4)) + '장' : '사진';
          else if (y < p.photo + p.emo) text = '이모티콘';
          else if (y < p.photo + p.emo + 0.01) text = pick(r, LINKS);
          else if (y < p.photo + p.emo + 0.012) text = '삭제된 메시지입니다.';
          else if (p.long && r() < 0.15) text = pick(r, LONG);
          else {
            text = pick(r, LINES);
            if (r() < p.laugh) text += ' ' + 'ㅋㅋㅋㅋㅋㅋ'.slice(0, 2 + Math.floor(r() * 5));
          }
          var ampm = h < 12 ? '오전' : '오후';
          var h12 = h % 12 === 0 ? 12 : h % 12;
          out.push('[' + p.name + '] [' + ampm + ' ' + h12 + ':' + pad(mi) + '] ' + text);
        });
        out.push('');
      }
      day.setDate(day.getDate() + 1);
    }
    return out.join('\n');
  }

  var api = { generate: generate };
  root.TalkSample = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
