# MYTFLIX

[TMDB](https://www.themoviedb.org/) API 의 `now_playing` 엔드포인트를 사용해 현재 상영 중인 영화를 Netflix 풍 UI 로 보여주는 정적 웹페이지.

## 미리보기

- 상단 Hero 영역: 첫 번째 영화의 backdrop / 제목 / 줄거리
- 그 아래 그리드: 영화 포스터 + 제목 + 평점 + 개봉일
- 포스터 카드를 클릭하면 해당 영화로 Hero 가 교체된다.

## 파일 구성

```
.
├── index.html          # 페이지 마크업
├── styles.css          # Netflix 풍 스타일 (다크 + #e50914 포인트 컬러)
├── script.js           # TMDB 호출 + 렌더링
├── config.js           # API 키 (gitignore 처리)
├── config.example.js   # config.js 의 예시 (공개 가능)
├── .gitignore
└── README.md
```

## 실행 방법

`fetch()` 가 동작하려면 정적 서버가 필요하다 (파일 더블클릭으로 열면 CORS / file:// 정책에 막힐 수 있음). 다음 중 하나로 실행한다.

### 1) Python (별도 설치 불필요, macOS 기본 제공)

```bash
cd /Users/user/work_kth/vibe_coding/myting-netflix
python3 -m http.server 5173
```

브라우저에서 `http://localhost:5173` 접속.

### 2) Node 환경

```bash
npx serve .
# 또는
npx http-server -p 5173
```

## API 키 관리

`config.js` 에 API 키가 들어가며 `.gitignore` 에 등록되어 있다. 다른 환경에서 셋업할 때는:

```bash
cp config.example.js config.js
# config.js 를 열어 API_KEY 값을 본인 키로 교체
```

> 클라이언트 사이드 JS 에 들어간 API 키는 브라우저 개발자 도구로 열람된다. 학습/개인 프로젝트용으로만 사용하고, 운영 환경에서는 백엔드 프록시를 두거나 토큰을 단기 발급해서 쓰는 것을 권장.

## 사용 API

- `GET https://api.themoviedb.org/3/movie/now_playing`
  - `api_key`: TMDB v3 API key
  - `language`: `ko-KR`
  - `region`: `KR`
  - `page`: 1
- 이미지 베이스: `https://image.tmdb.org/t/p/{size}{path}`
  - 포스터: `w500`
  - Hero 배경: `original`

## 커스터마이즈 포인트

- `script.js` 의 `POSTER_SIZE`, `BACKDROP_SIZE` 로 이미지 화질 조정.
- `config.js` 의 `LANGUAGE` 를 `en-US` 로 바꾸면 영문 타이틀/줄거리.
- `styles.css` 의 `--row__posters` 그리드 `minmax()` 값으로 카드 크기 조정.
