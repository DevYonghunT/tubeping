# 🚀 Tubeping 서비스 구축에 필요한 정보

## 📋 단계별로 제공해주셔야 할 정보

### ✅ 1단계: Supabase 설정 (최우선)

#### Supabase 프로젝트 생성 후 제공해주세요:
1. **Supabase Project URL**
   - 형식: `https://[project-id].supabase.co`
   - 위치: Supabase 대시보드 → Settings → API

2. **Supabase Anon Key (Public)**
   - 형식: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - 위치: Supabase 대시보드 → Settings → API → Project API keys → `anon` `public`

3. **Supabase Service Role Key (Secret)**
   - ⚠️ **주의**: 이 키는 절대 클라이언트에 노출되면 안 됩니다!
   - 형식: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - 위치: Supabase 대시보드 → Settings → API → Project API keys → `service_role` `secret`

4. **Database Connection String**
   - 형식: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
   - 위치: Supabase 대시보드 → Settings → Database → Connection string → Connection pooling → URI
   - 또는: Settings → Database → Connection string → Direct connection → URI

---

### ✅ 2단계: OpenAI API (AI 요약)

#### OpenAI 계정 생성 후 제공해주세요:
1. **OpenAI API Key**
   - 형식: `sk-...`
   - 위치: [platform.openai.com](https://platform.openai.com) → API keys → Create new secret key

---

### ✅ 3단계: Resend (이메일 전송)

#### Resend 계정 생성 후 제공해주세요:
1. **Resend API Key**
   - 형식: `re_...`
   - 위치: [resend.com](https://resend.com) → API Keys → Create API Key

2. **도메인 설정** (프로덕션용)
   - Resend에서 도메인 추가 및 DNS 설정 필요
   - 개발 단계에서는 Resend의 기본 도메인 사용 가능

---

### ✅ 4단계: YouTube Data API

#### Google Cloud Console에서 제공해주세요:
1. **YouTube Data API v3 Key**
   - 형식: `AIza...`
   - 위치: [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → Create Credentials → API Key

---

### ✅ 5단계: Google OAuth (Google 로그인)

#### Google Cloud Console에서 제공해주세요:
1. **Google Client ID**
   - 형식: `[숫자]-[문자].apps.googleusercontent.com`
   - 위치: Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs

2. **Google Client Secret**
   - 형식: `GOCSPX-...`
   - 위치: 위와 동일

3. **Authorized Redirect URIs 설정 필요**
   - 개발: `http://localhost:3000/api/auth/callback/google`
   - 프로덕션: `https://your-domain.vercel.app/api/auth/callback/google`

---

### ✅ 6단계: Kakao OAuth (Kakao 로그인)

#### Kakao Developers에서 제공해주세요:
1. **Kakao REST API Key (Client ID)**
   - 형식: `[숫자]`
   - 위치: [developers.kakao.com](https://developers.kakao.com) → 내 애플리케이션 → 앱 키

2. **Kakao Client Secret**
   - 형식: `[문자열]`
   - 위치: 내 애플리케이션 → 제품 설정 → 카카오 로그인 → Client Secret

3. **Redirect URI 설정 필요**
   - 개발: `http://localhost:3000/api/auth/callback/kakao`
   - 프로덕션: `https://your-domain.vercel.app/api/auth/callback/kakao`

---

### ✅ 7단계: Kakao 푸시 메시지 (선택사항, 나중에)

#### Kakao Developers에서 제공해주세요:
1. **Kakao Admin Key**
   - 형식: `[문자열]`
   - 위치: 내 애플리케이션 → 앱 키 → Admin Key

2. **Kakao 푸시 알림 설정**
   - 카카오톡 채널 연결 필요
   - 푸시 알림 권한 설정 필요

---

## 📝 환경 변수 파일 (.env.local) 예시

모든 정보를 받은 후 다음과 같이 설정됩니다:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# NextAuth (Supabase와 함께 사용)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[랜덤 문자열 - openssl rand -base64 32로 생성]

# OpenAI
OPENAI_API_KEY=sk-...

# Resend
RESEND_API_KEY=re_...

# YouTube
YOUTUBE_API_KEY=AIza...

# Google OAuth
GOOGLE_CLIENT_ID=[숫자]-[문자].apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...

# Kakao OAuth
KAKAO_CLIENT_ID=[숫자]
KAKAO_CLIENT_SECRET=[문자열]

# Kakao Push (나중에)
KAKAO_ADMIN_KEY=[문자열]
```

---

## 🎯 우선순위별 진행 순서

1. **Supabase 설정** (최우선) - DB & Auth 기반
2. **OpenAI API** - AI 요약 기능
3. **Resend** - 이메일 알림
4. **YouTube Data API** - 채널 모니터링
5. **Google OAuth** - 소셜 로그인
6. **Kakao OAuth** - 소셜 로그인
7. **Kakao 푸시** - 추가 알림 기능

---

## 📚 각 서비스 가입/설정 가이드

### Supabase
1. [supabase.com](https://supabase.com) 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인
4. "New Project" 생성
5. 프로젝트 이름, 데이터베이스 비밀번호 설정
6. 리전 선택 (가장 가까운 곳)
7. 프로젝트 생성 완료 후 위 정보 확인

### OpenAI
1. [platform.openai.com](https://platform.openai.com) 접속
2. 계정 생성 또는 로그인
3. "API keys" 메뉴 클릭
4. "Create new secret key" 클릭
5. 키 이름 설정 후 생성
6. ⚠️ 키는 한 번만 표시되므로 복사해서 안전하게 보관

### Resend
1. [resend.com](https://resend.com) 접속
2. "Get Started" 클릭
3. 이메일로 계정 생성
4. "API Keys" 메뉴에서 새 키 생성
5. 개발 단계에서는 기본 도메인 사용 가능

### YouTube Data API
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "APIs & Services" → "Library"
4. "YouTube Data API v3" 검색 후 활성화
5. "Credentials" → "Create Credentials" → "API Key"
6. API 키 생성 후 제한 설정 (선택사항)

### Google OAuth
1. Google Cloud Console에서 동일한 프로젝트 사용
2. "APIs & Services" → "Credentials"
3. "Create Credentials" → "OAuth client ID"
4. Application type: "Web application"
5. Authorized redirect URIs 추가 (위 참조)
6. Client ID와 Secret 복사

### Kakao OAuth
1. [developers.kakao.com](https://developers.kakao.com) 접속
2. "내 애플리케이션" → "애플리케이션 추가하기"
3. 앱 이름, 사업자명 입력
4. "플랫폼 설정" → "Web 플랫폼 등록"
5. "카카오 로그인" 활성화
6. Redirect URI 등록 (위 참조)
7. "제품 설정" → "카카오 로그인" → "동의항목" 설정
8. REST API Key와 Client Secret 확인

---

## ✅ 체크리스트

각 단계 완료 후 체크해주세요:

- [ ] Supabase 프로젝트 생성 및 정보 제공
- [ ] OpenAI API 키 발급 및 제공
- [ ] Resend API 키 발급 및 제공
- [ ] YouTube Data API 키 발급 및 제공
- [ ] Google OAuth 설정 및 정보 제공
- [ ] Kakao OAuth 설정 및 정보 제공
- [ ] (선택) Kakao 푸시 설정 및 정보 제공

---

## 🚀 다음 단계

위 정보를 모두 제공해주시면, 제가 코드를 업데이트하고 설정을 완료해드리겠습니다!

**우선 Supabase 설정부터 시작해주세요!** 🎯

