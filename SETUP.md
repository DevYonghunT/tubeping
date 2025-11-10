# 🚀 Tubeping 설정 가이드

이 문서는 Tubeping 서비스를 처음 설정하는 방법을 안내합니다.

## 📋 필수 사항

1. Node.js 18 이상
2. PostgreSQL 데이터베이스
3. 각종 API 키 (아래 참조)

## 🔑 API 키 발급 가이드

### 1. YouTube Data API

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성
3. "API 및 서비스" > "라이브러리"에서 "YouTube Data API v3" 검색 및 활성화
4. "사용자 인증 정보" > "사용자 인증 정보 만들기" > "API 키" 선택
5. 생성된 API 키를 `.env` 파일의 `YOUTUBE_API_KEY`에 입력

### 2. OpenAI API

1. [OpenAI Platform](https://platform.openai.com/) 접속
2. 계정 생성 또는 로그인
3. "API keys" 섹션에서 "Create new secret key" 클릭
4. 생성된 키를 `.env` 파일의 `OPENAI_API_KEY`에 입력

### 3. Resend (이메일 전송)

1. [Resend](https://resend.com/) 접속
2. 무료 계정 생성
3. "API Keys"에서 새 API 키 생성
4. 생성된 키를 `.env` 파일의 `RESEND_API_KEY`에 입력
5. (프로덕션) 도메인 추가 및 DNS 설정

### 4. Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. "API 및 서비스" > "사용자 인증 정보"
3. "OAuth 2.0 클라이언트 ID" 생성
4. 애플리케이션 유형: "웹 애플리케이션"
5. 승인된 리디렉션 URI 추가:
   - 개발: `http://localhost:3000/api/auth/callback/google`
   - 프로덕션: `https://yourdomain.com/api/auth/callback/google`
6. Client ID와 Client Secret을 `.env`에 입력

### 5. Kakao OAuth

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. "내 애플리케이션" > "애플리케이션 추가하기"
3. 앱 이름, 사업자명 입력
4. "플랫폼 설정" > "Web 플랫폼 등록"
   - 사이트 도메인: `http://localhost:3000` (개발)
5. "카카오 로그인" > "활성화 설정" ON
6. Redirect URI 등록:
   - `http://localhost:3000/api/auth/callback/kakao` (개발)
   - `https://yourdomain.com/api/auth/callback/kakao` (프로덕션)
7. "제품 설정" > "카카오 로그인" > "동의항목"에서 이메일, 닉네임, 프로필 사진 동의 설정
8. "앱 키"에서 REST API 키를 Client ID로, Client Secret 생성 후 `.env`에 입력

### 6. 이메일 (Magic Link용, 선택사항)

이메일 로그인을 사용하려면 SMTP 설정이 필요합니다.

**Gmail 사용 시:**
1. Google 계정 설정에서 "2단계 인증" 활성화
2. "앱 비밀번호" 생성
3. `.env`에 다음 설정:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM=noreply@tubeping.com
   ```

## 🗄 데이터베이스 설정

### 로컬 PostgreSQL

1. PostgreSQL 설치 및 실행
2. 데이터베이스 생성:
   ```sql
   CREATE DATABASE tubeping;
   ```
3. `.env`에 연결 문자열 입력:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/tubeping?schema=public"
   ```

### Supabase (클라우드 옵션)

1. [Supabase](https://supabase.com/) 접속 및 계정 생성
2. 새 프로젝트 생성
3. "Settings" > "Database"에서 연결 문자열 복사
4. `.env`에 입력

### Vercel Postgres

1. Vercel에 프로젝트 배포
2. "Storage" > "Create Database" > "Postgres" 선택
3. 자동으로 환경 변수에 추가됨

## ⚙️ 환경 변수 설정

1. `.env.example` 파일을 `.env`로 복사:
   ```bash
   cp .env.example .env
   ```

2. `.env` 파일을 열어 모든 필수 값 입력

3. `NEXTAUTH_SECRET` 생성:
   ```bash
   openssl rand -base64 32
   ```

4. `CRON_SECRET` 생성 (Vercel 배포 시):
   ```bash
   openssl rand -base64 32
   ```

## 🏃 실행하기

1. 의존성 설치:
   ```bash
   npm install
   ```

2. Prisma 클라이언트 생성:
   ```bash
   npm run db:generate
   ```

3. 데이터베이스 마이그레이션:
   ```bash
   npm run db:push
   ```

4. 개발 서버 실행:
   ```bash
   npm run dev
   ```

5. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 🚢 배포 (Vercel)

1. GitHub에 코드 푸시

2. [Vercel](https://vercel.com/) 접속 및 프로젝트 import

3. 환경 변수 설정:
   - Vercel 대시보드 > 프로젝트 > Settings > Environment Variables
   - 모든 `.env` 변수 추가

4. 데이터베이스 연결:
   - Vercel Postgres 사용 또는 외부 데이터베이스 연결 문자열 입력

5. 배포 완료 후 자동으로 Cron 작업 설정됨

## ✅ 확인 사항

- [ ] 모든 API 키가 올바르게 설정되었는가?
- [ ] 데이터베이스 연결이 정상인가?
- [ ] 로그인이 작동하는가?
- [ ] 채널 등록이 작동하는가?
- [ ] 이메일 전송이 작동하는가? (Resend 설정 확인)

## 🐛 문제 해결

### "YouTube API key not configured" 오류
- `.env` 파일에 `YOUTUBE_API_KEY`가 설정되어 있는지 확인
- API 키가 유효한지 확인

### "OpenAI API key not configured" 오류
- `.env` 파일에 `OPENAI_API_KEY`가 설정되어 있는지 확인
- API 키에 충분한 크레딧이 있는지 확인

### 로그인이 작동하지 않음
- OAuth 리디렉션 URI가 올바르게 설정되었는지 확인
- `NEXTAUTH_URL`이 올바른지 확인
- 브라우저 콘솔에서 오류 확인

### 이메일이 전송되지 않음
- Resend API 키가 올바른지 확인
- Resend에서 도메인 인증이 완료되었는지 확인 (프로덕션)
- Resend 대시보드에서 전송 로그 확인

## 📞 지원

문제가 발생하면 GitHub Issues에 등록해주세요.

