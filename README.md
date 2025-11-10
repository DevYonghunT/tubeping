# 🎬 Tubeping (튜브핑)

유튜브 채널의 새 영상을 자동으로 감지하고 AI로 요약하여 이메일로 받아보는 서비스입니다.

## ✨ 주요 기능

- 🔐 **다양한 로그인 방식**: 이메일, Google, Kakao 소셜 로그인 지원
- 📺 **채널 모니터링**: 유튜브 채널 URL을 등록하여 자동 모니터링
- ⏰ **자동 체크**: 매일 아침 7시에 등록된 채널 자동 확인
- 🤖 **AI 요약**: OpenAI를 활용한 영상 내용 요약
- 📧 **이메일 알림**: 새 영상 발견 시 이메일로 자동 알림

## 🛠 기술 스택

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **인증**: NextAuth.js v5
- **데이터베이스**: PostgreSQL (Prisma ORM)
- **외부 API**: YouTube Data API v3, OpenAI API
- **이메일**: Resend
- **배포**: Vercel

## 🚀 시작하기

### 1. 저장소 클론 및 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# 데이터베이스
DATABASE_URL="postgresql://user:password@localhost:5432/tubeping?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth - Google
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OAuth - Kakao
KAKAO_CLIENT_ID="your-kakao-client-id"
KAKAO_CLIENT_SECRET="your-kakao-client-secret"

# 이메일 (Magic Link용 - 선택사항)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@tubeping.com"

# YouTube API
YOUTUBE_API_KEY="your-youtube-api-key"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# 이메일 전송 (Resend)
RESEND_API_KEY="your-resend-api-key"

# Cron 보안 (Vercel 배포 시)
CRON_SECRET="your-random-secret-key"
```

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 마이그레이션
npm run db:push
# 또는
npm run db:migrate
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📋 API 키 발급 가이드

### YouTube Data API

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리"에서 "YouTube Data API v3" 활성화
4. "사용자 인증 정보"에서 API 키 생성

### OpenAI API

1. [OpenAI Platform](https://platform.openai.com/) 접속
2. 계정 생성 또는 로그인
3. "API keys" 섹션에서 새 API 키 생성

### Resend (이메일 전송)

1. [Resend](https://resend.com/) 접속
2. 계정 생성
3. "API Keys"에서 새 API 키 생성
4. 도메인 추가 및 DNS 설정 (프로덕션 환경)

### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. "API 및 서비스" > "사용자 인증 정보"
3. "OAuth 2.0 클라이언트 ID" 생성
4. 승인된 리디렉션 URI에 `http://localhost:3000/api/auth/callback/google` 추가

### Kakao OAuth

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 등록
3. "플랫폼 설정"에서 Web 플랫폼 추가
4. "카카오 로그인" 활성화
5. Redirect URI에 `http://localhost:3000/api/auth/callback/kakao` 추가
6. "앱 키"에서 REST API 키와 Client Secret 확인

## 🏗 프로젝트 구조

```
tubeping/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   ├── dashboard/         # 대시보드
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth 엔드포인트
│   │   ├── channels/      # 채널 CRUD
│   │   └── cron/          # 스케줄링 작업
│   ├── layout.tsx
│   └── page.tsx           # 랜딩 페이지
├── components/            # 재사용 컴포넌트
├── lib/                   # 유틸리티
│   ├── auth.ts            # NextAuth 설정
│   ├── db.ts              # Prisma 클라이언트
│   ├── youtube.ts         # 유튜브 API
│   ├── openai.ts          # OpenAI API
│   └── email.ts           # 이메일 전송
├── prisma/                # Prisma 스키마
└── types/                 # TypeScript 타입
```

## 🚢 배포

### Vercel 배포

1. [Vercel](https://vercel.com/)에 프로젝트 연결
2. 환경 변수 설정
3. 데이터베이스 연결 (Vercel Postgres 또는 Supabase)
4. 자동 배포 완료

### Cron 작업 설정

Vercel에서는 `vercel.json` 파일을 통해 자동으로 Cron 작업이 설정됩니다.
매일 아침 7시 (UTC 기준)에 `/api/cron/check-videos` 엔드포인트가 호출됩니다.

로컬에서 테스트하려면:

```bash
curl -X GET http://localhost:3000/api/cron/check-videos \
  -H "Authorization: Bearer your-cron-secret"
```

## 📝 사용 방법

1. **회원가입/로그인**: 이메일, Google, 또는 Kakao로 로그인
2. **채널 등록**: 대시보드에서 유튜브 채널 URL과 알림 수신 이메일 입력
3. **자동 모니터링**: 매일 아침 7시에 자동으로 채널 확인
4. **이메일 수신**: 새 영상이 올라오면 AI 요약과 함께 이메일로 알림 수신

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 스키마 동기화
npm run db:push

# 데이터베이스 마이그레이션
npm run db:migrate

# Prisma Studio 실행 (데이터베이스 GUI)
npm run db:studio
```

## 📄 라이선스

MIT

## 🤝 기여

이슈와 풀 리퀘스트를 환영합니다!

