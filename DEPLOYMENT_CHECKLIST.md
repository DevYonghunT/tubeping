# 🚀 Tubeping 배포 완료 후 체크리스트

## ✅ 완료된 작업

- [x] GitHub 저장소에 코드 푸시
- [x] Vercel 배포 완료
- [x] 빌드 성공

## 🔧 다음 필수 설정 단계

### 1. 환경 변수 설정 (Vercel)

Vercel 대시보드에서 환경 변수를 설정해야 합니다:

1. Vercel 프로젝트 → **Settings** → **Environment Variables**
2. 다음 변수들을 추가:

#### 필수 환경 변수

```env
# Supabase (최우선)
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# NextAuth (필수)
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=[openssl rand -base64 32로 생성한 값]

# OpenAI (AI 요약용)
OPENAI_API_KEY=sk-...

# Resend (이메일 전송용)
RESEND_API_KEY=re_...

# YouTube Data API
YOUTUBE_API_KEY=AIza...

# Google OAuth (선택)
GOOGLE_CLIENT_ID=[숫자]-[문자].apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...

# Kakao OAuth (선택)
KAKAO_CLIENT_ID=[숫자]
KAKAO_CLIENT_SECRET=[문자열]

# Cron 보안
CRON_SECRET=[openssl rand -base64 32로 생성한 값]
```

### 2. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 접속
2. 새 프로젝트 생성
3. 프로젝트 정보:
   - Name: tubeping
   - Database Password: [강력한 비밀번호 설정]
   - Region: Northeast Asia (Seoul) 권장
4. 프로젝트 생성 완료 대기 (약 2분)

### 3. Supabase 정보 수집

Supabase 대시보드에서:

**Settings → API:**
- Project URL 복사 → `NEXT_PUBLIC_SUPABASE_URL`
- anon public key 복사 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- service_role secret key 복사 → `SUPABASE_SERVICE_ROLE_KEY`

**Settings → Database → Connection string:**
- Connection pooling → URI 복사 → `DATABASE_URL`

### 4. Prisma 마이그레이션 (Vercel)

환경 변수 설정 후:

**옵션 1: Vercel CLI 사용**
```bash
# Vercel CLI 설치
npm i -g vercel

# 환경 변수 가져오기
vercel env pull .env.local

# 로컬에서 마이그레이션
npm run db:push

# 또는 Vercel에서 직접 실행
vercel run prisma db push
```

**옵션 2: Vercel 대시보드**
1. Deployments → 최신 배포 선택
2. "..." 메뉴 → "Redeploy"
3. 재배포 중 자동으로 Prisma 클라이언트 생성됨

하지만 데이터베이스 스키마 적용은 수동으로 해야 합니다:
```bash
# 로컬에서 실행
vercel env pull .env.local
npm run db:push
```

### 5. OAuth Redirect URI 업데이트

#### Google OAuth
1. Google Cloud Console → Credentials
2. OAuth 2.0 Client ID 편집
3. Authorized redirect URIs에 추가:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

#### Kakao OAuth
1. Kakao Developers → 내 애플리케이션
2. 제품 설정 → 카카오 로그인 → Redirect URI에 추가:
   ```
   https://your-app.vercel.app/api/auth/callback/kakao
   ```

### 6. Resend 도메인 설정 (프로덕션)

1. Resend 대시보드 → Domains
2. 도메인 추가 (예: tubeping.com)
3. DNS 레코드 추가:
   - SPF
   - DKIM
   - DMARC
4. 도메인 인증 완료 후 이메일 전송 가능

### 7. 배포 재시작

모든 환경 변수 설정 후:
1. Vercel 대시보드 → Deployments
2. 최신 배포의 "..." → **Redeploy**
3. 또는 GitHub에 커밋 푸시 시 자동 재배포

## 📋 우선순위별 설정 순서

### 최소 기능 (회원가입/로그인)
1. ✅ Supabase 설정
2. ✅ DATABASE_URL 설정
3. ✅ NEXTAUTH_URL 설정
4. ✅ NEXTAUTH_SECRET 설정
5. ✅ Prisma 마이그레이션

### 소셜 로그인 추가
6. Google OAuth 설정
7. Kakao OAuth 설정

### 핵심 기능 (채널 모니터링)
8. YouTube Data API 설정
9. OpenAI API 설정
10. Resend API 설정
11. CRON_SECRET 설정

## 🔍 배포 URL 확인

Vercel 대시보드에서 배포 URL을 확인하세요:
- Production URL: `https://your-app.vercel.app`
- Preview URLs: 각 커밋마다 고유한 URL 생성

## 📝 현재 접속 가능한 페이지

환경 변수 설정 전에도 접속 가능:
- 랜딩 페이지: `https://your-app.vercel.app`
- 로그인 페이지: `https://your-app.vercel.app/login`
- 회원가입 페이지: `https://your-app.vercel.app/register`

환경 변수 설정 후 사용 가능:
- 실제 회원가입/로그인
- 대시보드
- 채널 등록
- 자동 모니터링

## 🆘 다음 단계

1. **Supabase 프로젝트 생성** (최우선)
2. **환경 변수 설정** (Vercel)
3. **Prisma 마이그레이션** (로컬 또는 Vercel)
4. **OAuth Redirect URI 업데이트**
5. **테스트**

상세 가이드는 다음 파일을 참고하세요:
- `SETUP_GUIDE.md` - 단계별 설정 가이드
- `REQUIRED_INFO.md` - 필요한 정보 정리
- `DATABASE_SETUP.md` - 데이터베이스 설정

---

## 🎯 현재 상태

✅ **배포 완료**: 코드가 Vercel에 성공적으로 배포됨  
⏳ **환경 변수 설정 필요**: 실제 기능 사용을 위해 필요  
⏳ **데이터베이스 설정 필요**: Supabase 프로젝트 생성 필요

배포 URL을 공유해 주시면 랜딩 페이지를 확인해 드리겠습니다!

