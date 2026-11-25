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
4. 애드센스 승인 후 `index.html`의 `<head>` 주석 위치에 광고 스크립트를 넣고, `ad-1`, `ad-2` 자리에 수동 광고 단위 넣기
   - 분석 결과 화면(`#result`)에는 광고를 넣지 않는다고 안내하고 있으니, 자동 광고를 켜면 결과 영역을 꼭 제외하세요.
   - 유럽·영국·스위스 방문자용 쿠키 동의 메시지는 애드센스의 "개인정보 보호 및 메시지"에서 켜세요.
5. Google Analytics 같은 통계 도구를 추가하면 `privacy.html` 4항에 그 내용을 덧붙이세요.

## 배포 (Cloudflare Pages)

Cloudflare Pages 프로젝트 `dantokreport`로 배포 중입니다: https://dantokreport.pages.dev

이 PC의 Node.js가 20이라 wrangler는 3 버전을 씁니다. 다시 배포하려면:

1. 공개할 파일만 별도 폴더(예: `dist`)에 복사합니다. **`README.md`와 `.claude` 폴더는 넣지 마세요.**
   (`assets`, `guide`, `404.html`, `index.html`, `og-image.png`, `privacy.html`, `r.html`, `robots.txt`, `sitemap.xml`)
2. 그 폴더가 있는 곳에서 실행합니다.

```powershell
npx wrangler@3 pages deploy dist --project-name dantokreport --branch main
```

- Cloudflare Pages는 주소의 `.html`을 떼어 줍니다(`/r.html` → `/r`). 공식 주소(canonical, sitemap)는 `.html` 없는 형태로 적어 두었습니다.
- 없는 주소는 `404.html`이 보여집니다.

배포 후 네이버 서치어드바이저와 구글 서치 콘솔에 사이트를 등록하고 `sitemap.xml`을 제출하세요.

## 법적 체크

- 대화 파일을 서버로 보내는 코드를 추가하지 마세요. "운영자 서버로 전송·저장하지 않는다"는 안내가 이 서비스의 핵심 신뢰 요소입니다.
- 개인정보처리방침의 내용(광고, 통계 도구, 보호책임자)은 실제 운영과 항상 일치해야 합니다. 바꾸면 시행일을 새로 적고 이전 방침을 변경 이력으로 남기세요.
- 사이트 이름, 로고, 색상에 메신저 회사의 상표나 브랜드 요소를 쓰지 마세요. 사용법 안내에서 앱 이름을 언급하는 정도는 괜찮습니다.
- 수익이 생기면 사업자등록과 종합소득세 신고를 하세요.
