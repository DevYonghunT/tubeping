# 🚀 Tubeping 다음 단계

## ✅ 완료된 작업

- [x] Next.js 프로젝트 구축
- [x] GitHub 저장소 생성 및 푸시
- [x] Vercel 배포 완료
- [x] Supabase 데이터베이스 설정
- [x] Prisma 마이그레이션 완료
- [x] 기본 환경 변수 설정 (DATABASE_URL, NEXTAUTH 등)

---

## 🎯 다음 단계: 핵심 API 설정 (우선순위 순)

### 1️⃣ 최우선: YouTube Data API (채널 모니터링)

#### 설정 방법:
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 생성 또는 선택
3. **APIs & Services** → **Library** → "YouTube Data API v3" 검색 → **Enable**
4. **Credentials** → **Create Credentials** → **API Key**
5. 생성된 키 복사

#### Vercel에 추가:
- **Key**: `YOUTUBE_API_KEY`
- **Value**: `AIza...` (복사한 값)

---

### 2️⃣ OpenAI API (AI 요약)

#### 설정 방법:
1. [platform.openai.com](https://platform.openai.com) 접속
2. 계정 생성 또는 로그인
3. **API keys** → **Create new secret key**
4. 키 이름 설정 → 생성
5. ⚠️ 키가 한 번만 표시되므로 즉시 복사

#### Vercel에 추가:
- **Key**: `OPENAI_API_KEY`
- **Value**: `sk-...` (복사한 값)

#### 비용:
- 첫 가입 시 무료 크레딧 제공
- gpt-4o-mini 모델 사용 (저렴함)
- 예상 비용: 영상 1개당 약 $0.001-0.002

---

### 3️⃣ Resend (이메일 전송)

#### 설정 방법:
1. [resend.com](https://resend.com) 접속
2. 계정 생성 (이메일 인증)
3. **API Keys** → **Create API Key**
4. 키 이름 설정 → 생성
5. 키 복사

#### Vercel에 추가:
- **Key**: `RESEND_API_KEY`
- **Value**: `re_...` (복사한 값)

#### 무료 티어:
- 월 100개 이메일 무료
- 개발/테스트 충분

#### 프로덕션 설정:
- 도메인 추가 및 DNS 설정 필요 (나중에)

---

### 4️⃣ NEXTAUTH_SECRET & CRON_SECRET 생성

터미널에서 실행:

```bash
# NEXTAUTH_SECRET 생성
openssl rand -base64 32

# CRON_SECRET 생성 (다시 실행)
openssl rand -base64 32
```

두 개의 다른 값이 나옵니다. 각각 Vercel에 추가:

- **Key**: `NEXTAUTH_SECRET`, **Value**: [첫 번째 값]
- **Key**: `CRON_SECRET`, **Value**: [두 번째 값]

---

### 5️⃣ Google OAuth (선택사항)

Google 로그인을 사용하려면:

1. Google Cloud Console에서 동일한 프로젝트 사용
2. **Credentials** → **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Authorized redirect URIs:
   ```
   https://tubeping.vercel.app/api/auth/callback/google
   ```
5. Client ID와 Secret 복사

#### Vercel에 추가:
- **Key**: `GOOGLE_CLIENT_ID`, **Value**: [복사한 Client ID]
- **Key**: `GOOGLE_CLIENT_SECRET`, **Value**: [복사한 Secret]

---

### 6️⃣ Kakao OAuth (선택사항)

Kakao 로그인을 사용하려면:

1. [developers.kakao.com](https://developers.kakao.com) 접속
2. 애플리케이션 추가
3. 플랫폼 설정 → Web
4. 카카오 로그인 활성화
5. Redirect URI:
   ```
   https://tubeping.vercel.app/api/auth/callback/kakao
   ```
6. REST API 키와 Client Secret 확인

#### Vercel에 추가:
- **Key**: `KAKAO_CLIENT_ID`, **Value**: [REST API 키]
- **Key**: `KAKAO_CLIENT_SECRET`, **Value**: [Client Secret]

---

## 📋 환경 변수 설정 우선순위

### 지금 바로 설정 (핵심 기능)
1. ✅ YOUTUBE_API_KEY
2. ✅ OPENAI_API_KEY
3. ✅ RESEND_API_KEY
4. ✅ NEXTAUTH_SECRET
5. ✅ CRON_SECRET

### 나중에 설정 (소셜 로그인)
6. ⏳ GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
7. ⏳ KAKAO_CLIENT_ID & KAKAO_CLIENT_SECRET

---

## 🚀 빠른 시작 가이드

### 1단계: YouTube API 키 발급
[Google Cloud Console](https://console.cloud.google.com) → API Library → YouTube Data API v3 → Enable → Create Credentials

### 2단계: OpenAI API 키 발급
[OpenAI Platform](https://platform.openai.com) → API keys → Create new secret key

### 3단계: Resend API 키 발급
[Resend](https://resend.com) → Sign up → API Keys → Create

### 4단계: Secret 키 생성
```bash
openssl rand -base64 32
openssl rand -base64 32
```

### 5단계: Vercel 환경 변수에 모두 추가
Settings → Environment Variables → Add Variable (각각)

### 6단계: Vercel 재배포
Deployments → Redeploy

---

## ✅ 테스트 방법

환경 변수 설정 후:

1. https://tubeping.vercel.app 접속
2. **회원가입** 또는 **로그인**
3. **채널 등록** (YouTube 채널 URL 입력)
4. 수동 테스트: 채널의 최신 영상 확인
5. 자동 모니터링: 매일 아침 7시에 자동 실행

---

## 🆘 필요한 정보 요약

지금 발급받아야 할 API 키들:

- [ ] YouTube Data API Key (Google Cloud Console)
- [ ] OpenAI API Key (OpenAI Platform)
- [ ] Resend API Key (Resend.com)
- [ ] NEXTAUTH_SECRET (openssl 명령어)
- [ ] CRON_SECRET (openssl 명령어)

어떤 것부터 설정할까요? 단계별로 도와드리겠습니다! 🎯

