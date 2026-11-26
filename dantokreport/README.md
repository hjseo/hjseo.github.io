# 단톡 리포트

단톡방 대화 내보내기 파일을 **브라우저 안에서만** 분석하는 정적 사이트입니다. 서버, DB, 회원가입이 없습니다.

## 파일 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 메인 페이지 (업로드, 결과, 내보내기 방법, FAQ) |
| `privacy.html` | 개인정보처리방침 (애드센스 승인에 필요) |
| `assets/parser.js` | 내보내기 파일 파서 (PC, 안드로이드, 아이폰, Mac CSV, 영문 일부) |
| `assets/stats.js` | 통계와 칭호 계산 |
| `assets/sample.js` | "예시로 먼저 보기"용 가상 대화 생성 |
| `assets/app.js` | 화면 렌더링, 툴팁, 결과 카드 이미지 저장, 결과 링크 |
| `assets/sharelink.js` | 결과 요약을 링크(# 뒤)에 담고 푸는 코드 |
| `assets/unzip.js` | .zip 파일에서 대화 파일만 찾아 꺼내기 (목차만 읽고 사진은 안 읽음) |
| `assets/inapp.js` | 메신저·SNS 앱 안 브라우저 감지, 외부 브라우저 안내, 길게 눌러 이미지 저장 |
| `r.html` | 공유 링크로 연 결과 화면 (광고·통계 스크립트 넣지 말 것) |
| `assets/style.css` | 스타일 (라이트/다크 자동) |
| `robots.txt`, `sitemap.xml` | 검색엔진용 |

## 로컬에서 보기

`index.html`을 브라우저로 바로 열어도 동작합니다. 로컬 서버로 보려면:

```powershell
npx serve .
```

## 배포 전에 바꿀 것

1. 도메인은 `dantokreport.com`으로 설정됨 (canonical, og, robots.txt, sitemap.xml). 바꾸려면 이 주소를 전부 찾아 바꾸기 (`assets/sample.js`의 example.com은 예시 대화용이라 그대로 둠)
2. `privacy.html`의 시행일(2026년 11월 25일)이 실제 공개일과 다르면 고치기
3. 공유 미리보기 이미지 `og-image.png`(1200×630)는 만들어 두었음. 디자인을 바꾸려면 새로 만들어 같은 이름으로 교체
4. 애드센스 코드(ca-pub-3282029099369003)와 `ads.txt`는 넣어 두었음. 승인 후 `ad-1`, `ad-2`와 가이드 글의 광고 자리에 수동 광고 단위 넣기. `r.html`과 `404.html`에는 광고 코드를 넣지 않음
   - 분석 결과 화면(`#result`)에는 광고를 넣지 않는다고 안내하고 있으니, 자동 광고를 켜면 결과 영역을 꼭 제외하세요.
   - 유럽·영국·스위스 방문자용 쿠키 동의 메시지는 애드센스의 "개인정보 보호 및 메시지"에서 켜세요.
5. Google Analytics 같은 통계 도구를 추가하면 `privacy.html` 4항에 그 내용을 덧붙이세요.

## 배포 (Cloudflare Pages)

Cloudflare Pages 프로젝트 `dantokreport`로 배포 중입니다: https://dantokreport.pages.dev

이 PC의 Node.js가 20이라 wrangler는 3 버전을 씁니다. 다시 배포하려면 배포용 폴더(예: `site`)를 이렇게 만듭니다.

```
site/
├─ dist/            ← 공개할 파일만 (README.md, .claude, functions, wrangler.toml은 넣지 않기)
│   assets, guide, 404.html, about.html, ads.txt, index.html, og-image.png,
│   privacy.html, r.html, robots.txt, sitemap.xml
├─ functions/       ← 이 폴더의 functions 그대로 (짧은 결과 링크 서버 기능)
└─ wrangler.toml    ← 이 폴더의 wrangler.toml 그대로 (KV 저장소 연결 설정)
```

`site` 폴더 안에서 실행합니다.

```powershell
npx wrangler@3 pages deploy --project-name dantokreport --branch main
```

배포 전에 로컬에서 서버 기능까지 확인하려면 `site` 폴더에서 `npx wrangler@3 pages dev`를 실행하고 http://127.0.0.1:8788 을 엽니다.

- Cloudflare Pages는 주소의 `.html`을 떼어 줍니다(`/r.html` → `/r`). 공식 주소(canonical, sitemap)는 `.html` 없는 형태로 적어 두었습니다.
- 없는 주소는 `404.html`이 보여집니다.

배포 후 네이버 서치어드바이저와 구글 서치 콘솔에 사이트를 등록하고 `sitemap.xml`을 제출하세요.

## 짧은 결과 링크

- "결과 링크 복사"를 누르면 `POST /api/share`로 통계 요약(원본 대화 아님)을 Cloudflare KV(`dantokreport-share`)에 **30일** 보관하고 `https://dantokreport.com/r/아이디`를 돌려줍니다.
- `/r/아이디`를 열면 `r.html`이 뜨고, 페이지가 `GET /api/s/아이디`로 요약을 가져와 그립니다.
- 서버를 쓸 수 없으면(로컬 미리보기, 오류) 예전 방식인 긴 링크(`/r.html#요약`)로 자동 대체되고, 예전 긴 링크도 계속 열립니다.
- 다른 사이트에서 보낸 요청과 형식이 맞지 않는 데이터는 거절합니다.
- 무료 요금제의 KV 쓰기는 하루 1,000회입니다. 넘으면 그날은 긴 링크로 대체됩니다.

**삭제 요청을 받으면** (링크 주소 끝의 아이디가 `x7Kp2aB`라면) `site` 폴더에서:

```powershell
npx wrangler@3 kv key delete "s:x7Kp2aB" --namespace-id 2727fb1a23d44ee59c4b125384eb8798
```

## 법적 체크

- 대화 파일을 서버로 보내는 코드를 추가하지 마세요. "대화 파일은 운영자 서버로 전송·저장하지 않는다"는 안내가 이 서비스의 핵심 신뢰 요소입니다.
- 짧은 링크용으로 보관하는 요약의 항목이나 보관 기간(30일)을 바꾸면 개인정보처리방침 2항(국외 이전 표 포함)도 함께 고치세요.
- 개인정보처리방침의 내용(광고, 통계 도구, 보호책임자)은 실제 운영과 항상 일치해야 합니다. 바꾸면 시행일을 새로 적고 이전 방침을 변경 이력으로 남기세요.
- 사이트 이름, 로고, 색상에 메신저 회사의 상표나 브랜드 요소를 쓰지 마세요. 사용법 안내에서 앱 이름을 언급하는 정도는 괜찮습니다.
- 수익이 생기면 사업자등록과 종합소득세 신고를 하세요.

## CSS·JS를 고쳤을 때 (중요)

휴대폰 브라우저는 CSS·JS 파일을 몇 시간 동안 저장해 두고 씁니다. 그래서 HTML의 `assets/...css`, `assets/...js` 주소 끝에 `?v=날짜-번호` 버전을 붙여 두었습니다.
**`assets` 안의 파일을 고치면 모든 HTML의 `?v=` 값을 새 값으로 바꿔야** 방문자가 바로 새 파일을 받습니다. (예: `?v=20261125-3` → `?v=20261201-1`)
