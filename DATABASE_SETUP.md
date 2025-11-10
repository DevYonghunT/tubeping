# 데이터베이스 설정 가이드

## 🏆 추천: Vercel Postgres (가장 간단)

### 장점
- ✅ Vercel과 완벽 통합
- ✅ 무료 티어 제공 (256MB, 60시간/월)
- ✅ 자동 백업 및 관리
- ✅ Prisma와 완벽 호환
- ✅ 설정이 매우 간단

### 설정 방법

#### 1. Vercel에 프로젝트 배포
```bash
# Vercel CLI 설치 (선택사항)
npm i -g vercel

# 프로젝트 배포
vercel
```

또는 GitHub에 푸시 후 Vercel 웹사이트에서 import

#### 2. Vercel 대시보드에서 Postgres 추가
1. Vercel 대시보드 접속
2. 프로젝트 선택 → **Storage** 탭
3. **Create Database** → **Postgres** 선택
4. 데이터베이스 생성 완료

#### 3. 환경 변수 자동 설정
- Vercel이 자동으로 `DATABASE_URL` 환경 변수를 추가합니다
- 추가로 필요한 환경 변수:
  ```
  NEXTAUTH_URL=https://your-domain.vercel.app
  NEXTAUTH_SECRET=랜덤-문자열-생성
  ```

#### 4. 로컬 개발용 설정
```bash
# Vercel CLI로 환경 변수 가져오기
vercel env pull .env.local
```

#### 5. Prisma 마이그레이션
```bash
npm run db:generate
npm run db:push
```

---

## 🥈 대안 1: Supabase (가장 인기)

### 장점
- ✅ 무료 티어가 넉넉함 (500MB)
- ✅ 실시간 기능 포함
- ✅ 인증 시스템 내장
- ✅ 좋은 대시보드
- ✅ Vercel 외부에서도 사용 가능

### 설정 방법

#### 1. Supabase 계정 생성
1. [supabase.com](https://supabase.com) 접속
2. 무료 계정 생성
3. 새 프로젝트 생성

#### 2. 데이터베이스 연결 정보 가져오기
1. 프로젝트 설정 → **Database**
2. **Connection string** → **URI** 복사
3. 형식: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

#### 3. `.env` 파일 설정
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
```

#### 4. Prisma 마이그레이션
```bash
npm run db:generate
npm run db:push
```

---

## 🥉 대안 2: Neon (Serverless PostgreSQL)

### 장점
- ✅ Serverless (자동 스케일링)
- ✅ 무료 티어가 넉넉함 (3GB)
- ✅ 빠른 성능
- ✅ Prisma 완벽 지원

### 설정 방법

#### 1. Neon 계정 생성
1. [neon.tech](https://neon.tech) 접속
2. 무료 계정 생성
3. 새 프로젝트 생성

#### 2. 연결 문자열 복사
1. 프로젝트 대시보드에서 **Connection string** 복사
2. 형식: `postgresql://[user]:[password]@[hostname]/[database]?sslmode=require`

#### 3. `.env` 파일 설정
```env
DATABASE_URL="postgresql://[user]:[password]@[hostname]/[database]?sslmode=require"
```

#### 4. Prisma 마이그레이션
```bash
npm run db:generate
npm run db:push
```

---

## 💰 비용 비교 (초기 단계)

| 서비스 | 무료 티어 | 유료 시작 가격 | 추천 시기 |
|--------|----------|---------------|----------|
| **Vercel Postgres** | 256MB, 60시간/월 | $20/월 | Vercel 배포 시 |
| **Supabase** | 500MB | $25/월 | 독립적인 서비스 |
| **Neon** | 3GB | $19/월 | Serverless 필요 시 |
| **Railway** | $5 크레딧/월 | 사용량 기반 | 다양한 서비스 통합 |

---

## 🚀 빠른 시작 (Vercel Postgres 추천)

### 1단계: Vercel에 배포
```bash
# GitHub에 푸시
git init
git add .
git commit -m "Initial commit"
git remote add origin [your-github-repo]
git push -u origin main
```

### 2단계: Vercel에서 프로젝트 Import
1. [vercel.com](https://vercel.com) 접속
2. **Add New Project** → GitHub 저장소 선택
3. 배포 설정 확인 후 **Deploy**

### 3단계: Postgres 데이터베이스 추가
1. Vercel 프로젝트 대시보드
2. **Storage** 탭 → **Create Database** → **Postgres**
3. 데이터베이스 생성

### 4단계: 환경 변수 확인
- `DATABASE_URL`은 자동으로 설정됨
- 추가 설정:
  ```
  NEXTAUTH_URL=https://your-app.vercel.app
  NEXTAUTH_SECRET=[랜덤 문자열]
  ```

### 5단계: 마이그레이션 실행
Vercel 대시보드에서 또는 로컬에서:
```bash
vercel env pull .env.local
npm run db:generate
npm run db:push
```

---

## 📝 NEXTAUTH_SECRET 생성 방법

```bash
# 터미널에서 실행
openssl rand -base64 32
```

또는 온라인 생성기 사용:
- [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

---

## ✅ 최종 추천

**초기 서비스 시작**: **Vercel Postgres**
- 가장 간단한 설정
- Vercel과 완벽 통합
- 무료로 시작 가능
- 나중에 쉽게 확장 가능

**독립적인 서비스 원할 때**: **Supabase**
- 더 넉넉한 무료 티어
- 추가 기능 (실시간, 인증 등)
- Vercel 외부에서도 사용 가능

