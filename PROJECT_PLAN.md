# Tubeping (튜브핑) 프로젝트 계획서

## 📋 프로젝트 개요
유튜브 채널 모니터링 서비스로, 사용자가 등록한 채널의 새 영상을 감지하고 AI로 요약하여 이메일로 전송하는 서비스입니다.

## 🎯 핵심 기능

### 1. 사용자 인증
- **로그인 방식**: 이메일, 구글, 카카오톡 소셜 로그인
- **인증 라이브러리**: NextAuth.js (Next.js 기반)
- **초기 화면**: 로그인 버튼/메뉴 표시

### 2. 채널 등록
- 유튜브 채널 URL 입력
- 이메일 주소 입력 (알림 수신용)
- 로그인 후에만 접근 가능

### 3. 스케줄링 작업
- 매일 아침 7시에 등록된 채널 확인
- 유튜브 API를 통한 최신 영상 조회
- 이전 체크포인트와 비교하여 새 영상 감지

### 4. AI 요약
- OpenAI API (GPT-4 또는 GPT-3.5-turbo) 활용
- 영상 제목, 설명, 자막(가능한 경우) 분석
- 간결하고 읽기 쉬운 요약 생성

### 5. 이메일 전송
- 새 영상 감지 시 자동 이메일 발송
- 영상 링크 포함
- 요약 내용을 보기 좋게 디자인된 HTML 이메일

## 🛠 기술 스택

### 프론트엔드
- **Framework**: Next.js 14 (App Router)
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: shadcn/ui 또는 Radix UI
- **폼 관리**: React Hook Form
- **상태 관리**: React Context 또는 Zustand

### 백엔드
- **API**: Next.js API Routes
- **인증**: NextAuth.js v5
- **데이터베이스**: PostgreSQL (Supabase 또는 Vercel Postgres)
- **ORM**: Prisma

### 스케줄링 & 자동화
- **옵션 1**: Vercel Cron Jobs (Vercel 배포 시)
- **옵션 2**: n8n (무료 티어 사용 가능)
- **옵션 3**: GitHub Actions (무료)
- **옵션 4**: Upstash Cron (서버리스 크론)

### 외부 서비스
- **유튜브 API**: YouTube Data API v3
- **AI 요약**: OpenAI API
- **이메일 전송**: 
  - Resend (추천, 개발자 친화적)
  - SendGrid
  - AWS SES

### 배포
- **프론트엔드/백엔드**: Vercel (Next.js 최적화)
- **데이터베이스**: Supabase 또는 Vercel Postgres

## 📁 프로젝트 구조

```
tubeping/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   │   ├── login/
│   │   └── callback/
│   ├── dashboard/         # 대시보드 (로그인 후)
│   │   ├── page.tsx       # 채널 등록/관리
│   │   └── settings/
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth 엔드포인트
│   │   ├── channels/      # 채널 CRUD
│   │   ├── check/         # 수동 체크 엔드포인트
│   │   └── webhook/       # 스케줄러 웹훅
│   ├── layout.tsx
│   └── page.tsx           # 랜딩 페이지
├── components/            # 재사용 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   ├── auth/              # 인증 관련
│   └── dashboard/         # 대시보드 컴포넌트
├── lib/                   # 유틸리티
│   ├── auth.ts            # NextAuth 설정
│   ├── db.ts              # Prisma 클라이언트
│   ├── youtube.ts         # 유튜브 API
│   ├── openai.ts          # OpenAI API
│   └── email.ts             # 이메일 전송
├── prisma/                # Prisma 스키마
│   └── schema.prisma
├── public/                # 정적 파일
└── types/                 # TypeScript 타입
```

## 🔄 워크플로우

### 1. 사용자 등록 플로우
```
사용자 → 랜딩 페이지 → 로그인 → 대시보드 → 채널 URL + 이메일 입력 → 저장
```

### 2. 모니터링 플로우
```
스케줄러 (매일 7시) → 등록된 채널 목록 조회 → 유튜브 API로 최신 영상 확인 
→ 새 영상 감지 → OpenAI로 요약 생성 → 이메일 전송 → 체크포인트 업데이트
```

## 🎨 디자인 컨셉

### 참고 사이트 스타일
- PDF 편집기: 깔끔한 인터페이스, 명확한 액션 버튼
- 비밀번호 생성기: 단순하고 직관적, 결과가 명확하게 표시

### 디자인 원칙
1. **미니멀리즘**: 불필요한 요소 제거
2. **명확한 CTA**: 주요 액션 버튼이 눈에 띄게
3. **반응형 디자인**: 모바일/태블릿/데스크톱 지원
4. **다크모드 지원**: 사용자 선호도에 따라
5. **로딩 상태**: 명확한 피드백 제공

## 🔐 인증 구현

### NextAuth.js 설정
- **Providers**: 
  - Email (Magic Link)
  - Google OAuth
  - Kakao OAuth (카카오 개발자 앱 필요)
- **Database Session**: Prisma 어댑터 사용
- **JWT**: 세션 토큰 관리

## 📊 데이터베이스 스키마

```prisma
model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  name          String?
  image         String?
  accounts      Account[]
  sessions      Session[]
  channels      Channel[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Channel {
  id              String   @id @default(cuid())
  userId          String
  channelUrl      String
  channelId       String   // 유튜브 채널 ID
  email           String   // 알림 수신 이메일
  lastCheckedAt   DateTime @default(now())
  lastVideoId     String?  // 마지막 확인한 영상 ID
  isActive        Boolean  @default(true)
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([userId])
  @@index([channelId])
}
```

## ⚙️ n8n 또는 Maker 서비스 활용 방안

### n8n 사용 시나리오 (추천)
**장점**:
- 무료 티어 제공
- 시각적 워크플로우 빌더
- 다양한 통합 지원 (YouTube, OpenAI, Email)
- 웹훅 지원

**구현 방법**:
1. n8n에서 워크플로우 생성
2. Cron 트리거 설정 (매일 7시)
3. HTTP Request로 Next.js API 호출
4. 또는 n8n에서 직접 YouTube API + OpenAI + Email 처리

### Maker (Zapier 대안) 사용 시나리오
- 유사한 기능 제공
- 무료 티어 제한적
- n8n이 더 유연함

### 추천: Vercel Cron Jobs
- Next.js와 완벽 통합
- 서버리스 함수로 실행
- 무료 티어 제공
- 별도 서비스 불필요

## 🚀 개발 단계

### Phase 1: 기본 설정
1. Next.js 프로젝트 초기화
2. Tailwind CSS 설정
3. Prisma + 데이터베이스 설정
4. 기본 레이아웃 및 랜딩 페이지

### Phase 2: 인증 구현
1. NextAuth.js 설정
2. 이메일/구글/카카오 로그인 구현
3. 보호된 라우트 설정

### Phase 3: 채널 관리
1. 대시보드 UI 구현
2. 채널 등록 폼
3. 채널 목록 표시
4. 채널 삭제/수정 기능

### Phase 4: 유튜브 연동
1. YouTube Data API 설정
2. 채널 ID 추출 로직
3. 최신 영상 조회 기능
4. 새 영상 감지 로직

### Phase 5: AI 요약
1. OpenAI API 연동
2. 영상 정보 수집 (제목, 설명, 자막)
3. 요약 생성 로직
4. 요약 품질 최적화

### Phase 6: 이메일 전송
1. 이메일 서비스 연동 (Resend)
2. HTML 이메일 템플릿 디자인
3. 이메일 전송 로직

### Phase 7: 스케줄링
1. Vercel Cron Jobs 설정
2. 배치 작업 구현
3. 에러 핸들링 및 로깅

### Phase 8: 폴리싱
1. UI/UX 개선
2. 에러 처리 강화
3. 성능 최적화
4. 테스트

## 📝 환경 변수

```env
# 데이터베이스
DATABASE_URL=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=

# 이메일 (Magic Link)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=

# YouTube API
YOUTUBE_API_KEY=

# OpenAI
OPENAI_API_KEY=

# 이메일 전송 (Resend)
RESEND_API_KEY=
```

## 🎯 MVP (Minimum Viable Product) 범위

1. ✅ 이메일/구글 로그인 (카카오는 Phase 2)
2. ✅ 채널 등록 및 관리
3. ✅ 매일 7시 자동 체크
4. ✅ 새 영상 감지
5. ✅ AI 요약 생성
6. ✅ 이메일 전송

## 📈 향후 확장 가능성

- 여러 채널 동시 모니터링
- 요약 스타일 선택 (간단/상세)
- 알림 빈도 설정 (실시간/일일/주간)
- 웹 대시보드에서 요약 확인
- 영상 카테고리 필터링
- 통계 및 분석 기능

