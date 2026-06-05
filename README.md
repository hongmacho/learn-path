# 런패스(LearnPath)

자기주도 학습자를 위한 학습 경로 설계 및 진도 추적 웹 앱

## 주요 기능

### ✅ 8개 필수 기능

1. **학습 경로 CRUD** - 제목, 설명, 카테고리, 난이도, 예상 기간
2. **챕터/단원 구성** - 단계별 챕터 추가/수정/삭제
3. **챕터별 완료 체크** - 자동 진도율 계산
4. **일일 학습 기록** - 메모, 소요 시간, 날짜 기록
5. **연속 학습일(Streak)** - 매일 학습 자동 추적
6. **카테고리별 필터링** - 프론트엔드, 백엔드, AI/ML 등
7. **학습 경로 검색** - 실시간 검색 및 정렬
8. **학습 통계** - 주간/월간 학습 시간 및 분석

## 화면 구성 (6개+)

- **대시보드** - 연속 학습일, 이번 주 학습, 진행 중인 경로
- **경로 목록** - 검색, 필터, 경로 카드
- **경로 상세** - 진도율, 챕터 목록, 추가/삭제
- **기록 작성** - 학습 메모, 시간, 날짜 입력
- **통계** - 일별 시간, 카테고리별 분포
- **네비게이션** - 메인 네비, 빠른 접근

## 기술 스택

- **Frontend**: Next.js 15 + TypeScript + shadcn/ui + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Drizzle ORM + better-sqlite3

## 시작하기

### 설치

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인

### 빌드

```bash
npm run build
npm start
```

## API 스펙

### Learning Paths
- `GET /api/paths` - 경로 조회
- `POST /api/paths` - 경로 생성
- `GET /api/paths/[id]` - 상세 조회
- `PATCH /api/paths/[id]` - 수정
- `DELETE /api/paths/[id]` - 삭제

### Chapters & Study Logs
- `GET/POST /api/paths/[id]/chapters` - 챕터
- `PATCH/DELETE /api/chapters/[id]` - 수정/삭제
- `PATCH /api/chapters/[id]/complete` - 완료
- `GET/POST /api/logs` - 학습 기록
- `PATCH/DELETE /api/logs/[id]` - 수정/삭제

### Statistics
- `GET /api/stats?period=week|month` - 통계

## 한국어 UI

모든 텍스트가 한국어로 제공되며, 다크모드를 지원합니다.

## 완료 기준

- ✅ TypeScript 오류 0개
- ✅ 빌드 성공
- ✅ 6개 이상 화면 구현
- ✅ 8개 이상 기능 구현
- ✅ 한국어 UI 100%
- ✅ 빈 상태/로딩/에러 처리

---

**런패스로 당신의 학습 여정을 시작하세요! 🚀**
