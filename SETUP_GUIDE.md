# 🚀 Tubeping 서비스 설정 가이드

## 📋 단계별 설정 순서

### ✅ 1단계: Supabase 설정 (최우선)

#### Supabase 프로젝트 생성
1. [supabase.com](https://supabase.com) 접속
2. "Start your project" → GitHub로 로그인
3. "New Project" 생성
4. 프로젝트 정보 입력:
   - **Name**: tubeping (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (기록해두세요!)
   - **Region**: 가장 가까운 리전 선택 (예: Northeast Asia (Seoul))
5. 프로젝트 생성 완료 대기 (약 2분)

#### Supabase 정보 확인
1. Supabase 대시보드 → **Settings** → **API**
2. 다음 정보를 복사:

```
✅ Project URL: https://[project-id].supabase.co
✅ anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ service_role secret key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (⚠️ 절대 노출 금지!)
```

3. **Settings** → **Database** → **Connection string**
4. **Connection pooling** → **URI** 복사:

```
✅ Database URL: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

#### Prisma 스키마 적용
```bash
# .env.local 파일에 DATABASE_URL 설정 후
npm run db:generate
npm run db:push
```

---

### ✅ 2단계: 환경 변수 설정

`.env.local` 파일을 생성하고 다음 정보를 입력하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon public key]
SUPABASE_SERVICE_ROLE_KEY=[service_role secret key]
DATABASE_URL=[Database URL from Supabase]

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[랜덤 문자열 생성: openssl rand -base64 32]

# OpenAI (나중에)
OPENAI_API_KEY=

# Resend (나중에)
RESEND_API_KEY=

# YouTube (나중에)
YOUTUBE_API_KEY=

# Google OAuth (나중에)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Kakao OAuth (나중에)
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
```

---

### ✅ 3단계: OpenAI API 설정

1. [platform.openai.com](https://platform.openai.com) 접속
2. 계정 생성 또는 로그인
3. **API keys** → **Create new secret key**
4. 키 이름 설정 후 생성
5. ⚠️ 키는 한 번만 표시되므로 복사해서 안전하게 보관
6. `.env.local`에 추가:
   ```
   OPENAI_API_KEY=sk-...
   ```

---

### ✅ 4단계: Resend 이메일 설정

1. [resend.com](https://resend.com) 접속
2. "Get Started" → 이메일로 계정 생성
3. **API Keys** → **Create API Key**
4. 키 이름 설정 후 생성
5. `.env.local`에 추가:
   ```
   RESEND_API_KEY=re_...
   ```

**프로덕션 배포 시:**
- Resend에서 도메인 추가 필요
- DNS 설정 (SPF, DKIM, DMARC)

---

### ✅ 5단계: YouTube Data API 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **APIs & Services** → **Library**
4. "YouTube Data API v3" 검색
5. **Enable** 클릭
6. **Credentials** → **Create Credentials** → **API Key**
7. API 키 생성 후 복사
8. `.env.local`에 추가:
   ```
   YOUTUBE_API_KEY=AIza...
   ```

**API 제한 설정 (권장):**
- Credentials에서 생성한 API 키 클릭
- **API restrictions** → **Restrict key**
- **YouTube Data API v3**만 선택

---

### ✅ 6단계: Google OAuth 설정

1. Google Cloud Console에서 동일한 프로젝트 사용
2. **APIs & Services** → **Credentials**
3. **Create Credentials** → **OAuth client ID**
4. **Application type**: Web application
5. **Name**: Tubeping
6. **Authorized redirect URIs** 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.vercel.app/api/auth/callback/google
   ```
7. **Create** 클릭
8. Client ID와 Client Secret 복사
9. `.env.local`에 추가:
   ```
   GOOGLE_CLIENT_ID=[숫자]-[문자].apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-...
   ```

---

### ✅ 7단계: Kakao OAuth 설정

1. [developers.kakao.com](https://developers.kakao.com) 접속
2. **내 애플리케이션** → **애플리케이션 추가하기**
3. 앱 정보 입력:
   - **앱 이름**: Tubeping
   - **사업자명**: 개인 또는 회사명
4. **플랫폼 설정** → **Web 플랫폼 등록**
   - 사이트 도메인: `http://localhost:3000` (개발)
5. **제품 설정** → **카카오 로그인** → **활성화 설정** ON
6. **Redirect URI 등록**:
   ```
   http://localhost:3000/api/auth/callback/kakao
   https://your-domain.vercel.app/api/auth/callback/kakao
   ```
7. **동의항목** 설정:
   - 이메일 (필수)
   - 닉네임 (선택)
   - 프로필 사진 (선택)
8. **앱 키** 확인:
   - **REST API 키** (Client ID로 사용)
   - **Client Secret** 생성 (제품 설정 → 카카오 로그인 → Client Secret)
9. `.env.local`에 추가:
   ```
   KAKAO_CLIENT_ID=[REST API 키]
   KAKAO_CLIENT_SECRET=[Client Secret]
   ```

---

### ✅ 8단계: Kakao 푸시 메시지 (선택사항, 나중에)

1. Kakao Developers에서 동일한 앱 사용
2. **제품 설정** → **카카오톡 채널** 연결
3. **앱 키** → **Admin Key** 확인
4. 푸시 알림 권한 설정
5. `.env.local`에 추가:
   ```
   KAKAO_ADMIN_KEY=[Admin Key]
   ```

---

## 🔧 로컬 개발 환경 설정

### 1. 환경 변수 파일 생성
```bash
cp .env.example .env.local
```

### 2. .env.local 파일 편집
위에서 수집한 모든 정보를 입력

### 3. 의존성 설치
```bash
npm install
```

### 4. 데이터베이스 마이그레이션
```bash
npm run db:generate
npm run db:push
```

### 5. 개발 서버 실행
```bash
npm run dev
```

---

## 🚀 Vercel 배포 설정

### 1. GitHub에 코드 푸시
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin [your-github-repo]
git push -u origin main
```

### 2. Vercel에 프로젝트 Import
1. [vercel.com](https://vercel.com) 접속
2. **Add New Project** → GitHub 저장소 선택
3. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

### 3. 환경 변수 설정
Vercel 대시보드 → **Settings** → **Environment Variables**

`.env.local`의 모든 변수를 추가:
- **NEXT_PUBLIC_SUPABASE_URL**
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**
- **SUPABASE_SERVICE_ROLE_KEY**
- **DATABASE_URL**
- **NEXTAUTH_URL** (프로덕션 URL로 변경)
- **NEXTAUTH_SECRET**
- **OPENAI_API_KEY**
- **RESEND_API_KEY**
- **YOUTUBE_API_KEY**
- **GOOGLE_CLIENT_ID**
- **GOOGLE_CLIENT_SECRET**
- **KAKAO_CLIENT_ID**
- **KAKAO_CLIENT_SECRET**

### 4. 배포
**Deploy** 버튼 클릭

---

## ✅ 체크리스트

각 단계 완료 후 체크:

- [ ] Supabase 프로젝트 생성 및 정보 수집
- [ ] .env.local 파일 생성 및 Supabase 정보 입력
- [ ] Prisma 마이그레이션 실행
- [ ] OpenAI API 키 발급 및 설정
- [ ] Resend API 키 발급 및 설정
- [ ] YouTube Data API 키 발급 및 설정
- [ ] Google OAuth 설정 및 정보 입력
- [ ] Kakao OAuth 설정 및 정보 입력
- [ ] 로컬 개발 서버 테스트
- [ ] Vercel 배포 및 환경 변수 설정

---

## 🆘 문제 해결

### 데이터베이스 연결 오류
- DATABASE_URL이 올바른지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- 방화벽 설정 확인 (Supabase는 기본적으로 모든 IP 허용)

### 인증 오류
- NEXTAUTH_URL이 올바른지 확인
- NEXTAUTH_SECRET이 설정되어 있는지 확인
- OAuth Redirect URI가 정확한지 확인

### API 키 오류
- 각 서비스의 API 키가 올바른지 확인
- API 키의 권한/제한 설정 확인
- 사용량 한도 확인

---

## 📞 다음 단계

모든 설정이 완료되면:
1. 로컬에서 테스트
2. Vercel에 배포
3. 프로덕션 환경에서 테스트
4. 카카오 푸시 메시지 연동 (선택사항)

**우선 Supabase 설정부터 시작하세요!** 🎯

