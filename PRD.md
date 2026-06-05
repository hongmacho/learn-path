# 런패스(LearnPath) - PRD

## 1. 개요

### 서비스명
런패스(LearnPath) - 자기주도 학습 경로 설계 및 진도 추적 웹 앱

### 핵심 문제 (Pain Point)
개발자들이 새로운 기술(Rust, ML, WebGL 등)을 배울 때 체계적인 커리큘럼이 없어서:
- 유튜브 → 블로그 → 책 사이를 떠돌며 진도를 잃음
- 어디까지 배웠는지 추적하기 어려움
- 학습의 일관성을 유지하기 어려움

### 차별화 전략
| 경쟁사 | 런패스 |
|------|-------|
| **Coursera** | 고정 커리큘럼 | **자기주도** - 자신의 리소스로 경로 설계 |
| **Notion 학습 템플릿** | 무거운 설정 | **가볍고 직관적** - 즉시 시작 가능 |
| **Anki** | 카드식 학습 | **구조적 학습** - 단계별 챕터로 체계적 |
| **기타 학습 추적** | 진행 추적만 | **AI 없이도 구조화** - 설계 + 기록 + 통계 |

### 플랫폼 및 기술 스택
- **플랫폼**: 웹 (반응형)
- **Frontend**: Next.js 15 (App Router) + TypeScript + shadcn/ui + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Drizzle ORM + better-sqlite3
- **UI**: 한국어 완전 지원

---

## 2. 사용자 페르소나

### Primary User
- **역할**: 개발자, 데이터 과학자, 기술 전문가
- **연령**: 25-40세
- **학습 스타일**: 자기주도적, 체계적
- **목표**: 새 기술을 구조적으로 배우고 진도를 추적

### 사용 시나리오
```
1. "Rust를 배우고 싶은데, 어디서부터 시작할까?"
   → 런패스에서 학습 경로 생성 (예: "Rust 완전 정복")
   → 리소스별로 챕터 구성 (책 1장 → 튜토리얼 → 프로젝트)
   
2. "매일 30분씩 진도를 기록하고 싶어"
   → 매일 학습 기록 남기기
   → 연속 학습일(streak) 자동 추적
   
3. "이번 달에 얼마나 배웠는지 보고 싶어"
   → 주간/월간 통계 대시보드 확인
   → 카테고리별 진행 상황 비교
```

---

## 3. 기능 요구사항

### Must-Have Features (8개 이상)

#### 1. 학습 경로 CRUD
- **생성**: 제목, 설명, 카테고리, 난이도(초급/중급/고급), 예상 주수 입력
- **수정**: 경로 정보 업데이트
- **삭제**: 경로 제거 (활성/비활성 토글 포함)
- **조회**: 경로 목록 및 상세 조회

#### 2. 챕터/단원 구성
- 학습 경로 내 단계별 챕터 추가/수정/삭제
- 챕터 순서 변경
- 각 챕터에 설명 추가 가능

#### 3. 챕터별 완료 체크
- 챕터 완료 표시
- 완료 일시 자동 기록
- 진도율 자동 계산 (완료 챕터 / 전체 챕터)

#### 4. 일일 학습 기록
- 날짜별 학습 메모 작성
- 소요 시간(분) 기록
- 선택: 어느 챕터를 공부했는지 연결
- 수정/삭제 가능

#### 5. 연속 학습일(Streak) 추적
- 매일 학습하면 연속일 카운트
- 한 번 건너뛰면 0으로 리셋
- 대시보드에 표시

#### 6. 카테고리별 필터링
- 프론트엔드, 백엔드, AI/ML, 언어, 모바일, DevOps 등
- 선택한 카테고리만 표시
- 다중 선택 가능

#### 7. 학습 경로 검색
- 제목, 설명으로 검색
- 실시간 검색 결과
- 정렬 옵션 (최신순, 가장 진행된 것)

#### 8. 주간/월간 학습 통계 차트
- 일별 학습 시간
- 주간 학습 누적 시간
- 월간 완료된 경로 수
- 카테고리별 시간 분포

### Nice-to-Have Features
- 학습 경로 공유 링크
- 즐겨찾기 기능
- 태그 시스템
- 학습 목표 알림

---

## 4. 필수 화면 (최소 6개)

### Screen 1: 대시보드 (Dashboard)
- 진행 중인 학습 경로 (카드형, 진도율 바)
- 오늘 할 일 (Today's Focus)
- 연속 학습일 표시
- 어제부터의 진행 요약
- 빠른 추가 버튼

### Screen 2: 학습 경로 목록 (Learning Paths List)
- 경로 카드 목록 (진도율, 카테고리, 난이도)
- 검색창
- 카테고리 필터
- 정렬 옵션
- "새 경로 추가" 버튼
- 빈 상태 (경로가 없을 때)

### Screen 3: 학습 경로 상세 (Learning Path Details)
- 경로 제목, 설명, 카테고리, 난이도, 예상 기간
- 전체 진도율 바
- 챕터 목록 (완료 체크박스, 완료 일시, 설명)
- 챕터 추가/수정/삭제 버튼
- 경로 수정/삭제 버튼

### Screen 4: 학습 기록 작성 (Study Log Entry)
- 학습 경로 선택 (선택적)
- 챕터 선택 (선택적)
- 학습 메모 (텍스트 에어리어)
- 소요 시간 입력 (분 단위)
- 날짜 선택
- 저장/취소 버튼

### Screen 5: 학습 통계 (Study Statistics)
- 달력 히트맵 (GitHub 스타일)
- 주간 학습 시간 차트
- 월간 완료 경로 수
- 카테고리별 시간 분포 (파이/도넛 차트)
- 통계 기간 선택 (주/월)

### Screen 6: 설정 (Settings)
- 난이도 옵션 선택
- 카테고리 선택
- 테마 설정 (라이트/다크)
- 데이터 내보내기
- 앱 정보

---

## 5. 데이터 모델

### learning_paths 테이블
```
- id: UUID (PK)
- title: string (NOT NULL, UNIQUE)
- description: string
- category: enum (FRONTEND, BACKEND, AI_ML, LANGUAGE, MOBILE, DEVOPS, OTHER)
- difficulty: enum (BEGINNER, INTERMEDIATE, ADVANCED)
- estimated_weeks: integer
- is_active: boolean (default: true)
- created_at: timestamp (default: NOW)
- updated_at: timestamp (default: NOW)
```

### chapters 테이블
```
- id: UUID (PK)
- path_id: UUID (FK)
- title: string (NOT NULL)
- description: string
- order_index: integer
- is_completed: boolean (default: false)
- completed_at: timestamp (nullable)
- created_at: timestamp (default: NOW)
- updated_at: timestamp (default: NOW)

UNIQUE(path_id, order_index)
```

### study_logs 테이블
```
- id: UUID (PK)
- path_id: UUID (FK)
- chapter_id: UUID (FK, nullable)
- content: string (NOT NULL)
- duration_minutes: integer (default: 30)
- logged_at: date (default: TODAY)
- created_at: timestamp (default: NOW)
```

### streaks 테이블
```
- id: UUID (PK)
- date: date (UNIQUE)
- has_studied: boolean (default: false)
- created_at: timestamp (default: NOW)
```

---

## 6. API 스펙

### Learning Paths
- `GET /api/paths` - 전체 경로 조회 (필터, 검색, 페이지네이션)
- `POST /api/paths` - 새 경로 생성
- `GET /api/paths/[id]` - 경로 상세 조회
- `PATCH /api/paths/[id]` - 경로 수정
- `DELETE /api/paths/[id]` - 경로 삭제

### Chapters
- `GET /api/paths/[id]/chapters` - 경로의 챕터 목록
- `POST /api/paths/[id]/chapters` - 챕터 추가
- `PATCH /api/chapters/[id]` - 챕터 수정
- `DELETE /api/chapters/[id]` - 챕터 삭제
- `PATCH /api/chapters/[id]/complete` - 챕터 완료 표시

### Study Logs
- `GET /api/logs` - 학습 기록 조회 (날짜 범위, 경로별)
- `POST /api/logs` - 학습 기록 추가
- `PATCH /api/logs/[id]` - 학습 기록 수정
- `DELETE /api/logs/[id]` - 학습 기록 삭제

### Statistics
- `GET /api/stats` - 통계 데이터 (주간, 월간, 카테고리별)
- `GET /api/stats/streak` - 현재 연속 학습일
- `GET /api/stats/calendar` - 달력 데이터

---

## 7. UI/UX 가이드라인

### 색상 및 스타일
- 주색: 파란색 (#3B82F6)
- 보조색: 초록색 (#10B981 - 완료), 주황색 (#F59E0B - 진행 중)
- 다크모드 지원 필수
- shadcn/ui 컴포넌트 활용

### 레이아웃
- 데스크톱: 사이드바 네비게이션
- 모바일: 하단 탭 또는 햄버거 메뉴
- 반응형 디자인 필수

### 한국어 UI (절대 예외 없음)
모든 텍스트는 한국어로:
- 버튼: "경로 추가", "챕터 완료", "학습 기록 남기기"
- 라벨: "제목", "설명", "카테고리", "난이도"
- 메뉴: "대시보드", "학습 경로", "통계", "설정"
- 빈 상태: "아직 학습 경로가 없어요. 첫 번째 경로를 만들어 보세요!"
- 에러: "로딩 중 오류가 발생했습니다. 다시 시도해 주세요."

### 상태 처리
- **로딩**: Skeleton 컴포넌트
- **빈 상태**: 아이콘 + 설명 + CTA 버튼
- **에러**: 토스트 알림 + 재시도 옵션

---

## 8. 구현 일정

| 단계 | 작업 | 소요 시간 |
|------|------|----------|
| 1 | PRD 작성 | 완료 |
| 2 | 프로젝트 셋업 (Next.js, 의존성) | 15분 |
| 3 | DB 스키마 정의 (Drizzle) | 20분 |
| 4 | 핵심 로직 구현 (진도율, streak 등) | 30분 |
| 5 | API Routes 구현 | 60분 |
| 6 | UI 구현 (6개 화면) | 120분 |
| 7 | QA 및 버그 수정 | 30분 |
| 8 | README 작성 | 10분 |
| 9 | Git + GitHub push | 10분 |

---

## 9. 성공 기준

- [ ] TypeScript 오류 0개
- [ ] 빌드 성공
- [ ] 6개 이상 화면 구현
- [ ] 8개 이상 기능 구현
- [ ] 한국어 UI 100%
- [ ] 빈 상태/로딩/에러 처리 완성
- [ ] README.md 작성
- [ ] GitHub 저장소 생성 및 push

---

## 10. 추후 개선 사항

- AI 기반 학습 경로 제안
- 학습 커뮤니티 기능
- API를 통한 외부 리소스 통합
- 모바일 앱 (React Native)
- 팀/그룹 학습 기능
