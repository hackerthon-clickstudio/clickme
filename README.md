# 클릭미 (ClickMe)

AI 기반 광고 캠페인 도구입니다. 광고 소재 생성부터 성과 예측, 캠페인 집행·최적화까지 하나의 흐름으로 제공합니다.

```
광고 소재 생성 (Creative) → 성과 예측 (Simulation) → 캠페인 집행/최적화 (Campaign)
```

> 채팅/에이전트 기능(orchestration, conversation, knowledge)은 아직 없으며, 추후 추가 예정입니다.

## 기술 스택

| 구분 | 스택 |
|------|------|
| 백엔드 | Python 3.12, FastAPI, SQLAlchemy, Alembic, PostgreSQL |
| 프론트엔드 | Next.js (App Router), TypeScript — 모바일 우선 |
| 인프라 | Docker (web / api / worker), Nginx, GitHub Actions CI |
| 외부 연동 | OpenAI · Anthropic (LLM), AWS S3, AWS Cognito, Meta Ads |

## 개발 실행

루트 `package.json`에 개발 명령어를 모아 두었습니다. 저장소 루트에서 실행합니다. (최초 1회 `npm install` 필요 — `concurrently` 설치용)

```bash
npm run dev        # 백엔드 + 프론트 동시 기동 (api=파랑 / web=초록)
npm run dev:api    # 백엔드만  — uvicorn ... create_app --factory --reload --port 8000
npm run dev:web    # 프론트만  — next dev (http://localhost:3000)
npm run worker     # 워커(스케줄러) 실행
```

| 명령 | 하는 일 |
|------|---------|
| `npm run dev` | 백엔드 + 프론트 동시 기동 |
| `npm run dev:api` / `npm run dev:web` | 백엔드 / 프론트 개별 기동 |
| `npm run worker` | 워커(스케줄러) 실행 |
| `npm run test` | `uv run pytest` — 백엔드 전체 |
| `npm run test:arch` | 아키텍처 테스트만 (커밋 전 필수) |
| `npm run test:web` | 프론트 테스트 |
| `npm run lint` | 백엔드 ruff + 프론트 eslint |
| `npm run fmt` | 백엔드 ruff format + fix |
| `npm run gen:api` | OpenAPI → 프론트 클라이언트 재생성 |

> `pnpm dev`, `pnpm test` 처럼 pnpm으로 호출해도 동일하게 동작합니다.

> ⚠️ 현재는 스켈레톤 단계라 `create_app()`이 미구현(`NotImplementedError`)입니다. `dev:api`/`dev`의 **백엔드는 아직 실제로 뜨지 않으며**, 프론트(`dev:web`)만 정상 기동됩니다. `test:web`은 프론트 테스트 러너 설정 전까지 실행되지 않습니다.

각 앱을 직접 실행하려면:

```bash
# 백엔드
cd apps/backend && uv run uvicorn clickme.entrypoints.api.main:create_app --factory --reload --port 8000

# 프론트
cd apps/web && npm run dev
```

## 프로젝트 구조

모노레포 구성으로, 프론트와 백엔드가 `apps/` 아래에 있습니다.

```
clickme/
├─ apps/
│  ├─ web/          # Next.js 프론트엔드
│  └─ backend/      # FastAPI 백엔드
├─ contracts/       # openapi.yaml — 프론트 타입 생성의 원본
├─ infra/           # Docker, Nginx
├─ scripts/         # API 클라이언트 생성, 마이그레이션 스크립트
└─ docs/            # 아키텍처 문서, 의사결정 기록
```

### 프론트엔드 (`apps/web`)

- `src/app/` — 라우팅과 화면 조립만 담당합니다. 로직을 두지 않습니다.
- `src/modules/` — 기능별 모듈(campaign, creative, simulation). 백엔드 모듈과 1:1로 대응하며, 각 모듈은 `api / components / hooks / types`로 구성됩니다.
- `src/shared/` — 공용 API 클라이언트, UI 컴포넌트(Button, Dialog, BottomSheet 등), 훅, 유틸.
- `src/shared/api/generated/` — OpenAPI에서 자동 생성되는 코드로, **직접 수정하지 않습니다.**

### 백엔드 (`apps/backend/src/clickme`)

모듈형 클린 아키텍처를 따릅니다.

| 레이어 | 역할 |
|--------|------|
| `entrypoints/` | FastAPI 앱 생성·실행, 워커(스케줄러) 실행만 |
| `bootstrap/` | 의존성 조립(container), 라우터·잡 등록 |
| `interfaces/http/` | 미들웨어, 예외 처리, health 등 HTTP 공통만 |
| `modules/` | 비즈니스 모듈 3개: creative, simulation, campaign |
| `foundation/` | DB 세션, LLM 클라이언트, S3, 인증 등 기술 공용부 |
| `shared/kernel/` | 어디에도 종속되지 않는 최소 타입 (ids, clock) |

각 모듈 내부는 다음과 같이 나뉩니다.

- `public.py` — 다른 모듈에 공개하는 유일한 창구
- `api/` — 라우터와 요청/응답 스키마
- `application/` — 유스케이스(파일 1개 = 유스케이스 1개)와 ports(Protocol)
- `domain/` — 순수 Python 도메인 모델
- `infrastructure/` — ORM 모델, 리포지토리, 외부 연동 구현

## 아키텍처 규칙

이 프로젝트의 핵심 규칙입니다. 모듈 경계 관련 규칙은 `tests/architecture/`의 테스트가 자동으로 검증합니다.

1. **모듈 간 참조는 `public.py`를 통해서만.** 다른 모듈의 application/domain/infrastructure를 직접 import하지 않습니다.
2. **domain은 순수 Python.** FastAPI, SQLAlchemy, foundation, 외부 라이브러리 import 금지. 표준 라이브러리와 `shared/kernel`만 허용됩니다.
3. **application은 ports(Protocol)에 의존**하고, infrastructure가 이를 구현합니다. application에서 infrastructure를 직접 import하지 않습니다.
4. **라우터는 각 모듈의 `api/router.py`에만** 둡니다. 등록은 `bootstrap/routers.py`에서 합니다.
5. **`foundation/`에는 비즈니스 규칙을 두지 않습니다.** 기술 구현만 둡니다.
6. **외부 SDK 직접 import는 `foundation/` 안에서만.** `openai`, `anthropic`, `boto3`, SQLAlchemy 엔진/세션 생성 등은 foundation의 래퍼를 통해서만 사용합니다. 기술 교체 시 수정 지점이 한 곳으로 모입니다.
7. **DB 공통은 한곳에.** 모든 ORM 모델은 `foundation/database/base.py`의 Base와 mixin을 상속하고, Alembic 인식을 위해 `migrations/env.py`에서 전부 import합니다.
8. **LLM 호출은 `foundation/llm/client.py` 하나로.** 프롬프트는 각 모듈이 소유하되, 호출·재시도·타임아웃·토큰 로깅은 client.py를 거칩니다.
9. **YAGNI.** 이벤트 버스, Result 타입 등 미사용 추상화를 미리 만들지 않습니다. 유스케이스는 commands/queries 폴더로 쪼개지 않고 `application/` 바로 밑에 파일 하나로 둡니다.
10. **`public.py`에는 유스케이스 함수와 최소한의 읽기 DTO만 export합니다.** repository, ORM 모델, 인프라 구현체는 export하지 않습니다 — re-export하는 순간 모듈 경계가 무너집니다.
11. **Repository는 domain 객체를 반환합니다.** SQLAlchemy 모델을 application 층 밖으로 내보내지 않으며, ORM ↔ domain 매핑은 각 모듈의 `infrastructure/repository.py`가 책임집니다.
12. **하나의 유스케이스 = 하나의 트랜잭션.** 트랜잭션은 application 유스케이스가 `foundation/database/transaction.py`로 열고, repository는 commit하지 않습니다.
13. **도메인 객체는 생성 시점에 유효해야 합니다.** 불변식이 있는 엔티티는 검증하는 팩토리 메서드로 생성합니다. 불변식 없는 단순 값 객체까지 강제하지는 않습니다.
14. **ID는 `shared/kernel/ids.py`로 코드에서 생성합니다.** DB autoincrement를 쓰지 않아, 저장 전에도 도메인 객체가 식별자를 가질 수 있습니다.
15. **현재 시각은 `shared/kernel/clock.py`를 경유합니다.** `datetime.now()` 직접 호출을 금지해 테스트에서 시간을 고정할 수 있게 합니다.

## 새 기능 추가 순서

기능 하나를 추가할 때는 아래 순서를 따릅니다. 층을 건너뛰지 않는 것이 핵심입니다.

1. **Domain** — 엔티티·값 객체·정책 (`domain/`)
2. **Application** — 유스케이스 파일 + 필요한 ports 정의 (`application/`)
3. **Infrastructure** — repository·외부 연동 구현. `models.py` 변경 시 Alembic 마이그레이션 생성
4. **API** — `api/router.py` + `api/schemas.py`
5. **public.py** — 다른 모듈이 이 기능을 쓸 때만 export 추가
6. **bootstrap 등록** — `bootstrap/routers.py`(라우터) · `bootstrap/jobs.py`(잡) · `bootstrap/container.py`(의존성)
7. **테스트** — 아키텍처 테스트 + 단위 테스트 통과 확인
8. **OpenAPI 계약 갱신** — `contracts/openapi.yaml` 반영 후 스크립트로 프론트 클라이언트 재생성
9. **Front 구현** — `modules/<모듈>/` 아래 api · components · hooks · types

## 컨벤션

### 코드 스타일

- **Python**: 파일/함수는 snake_case, 클래스는 PascalCase. 타입 힌트 필수. ports는 `typing.Protocol` 사용.
- **Ruff**로 포맷·린트를 통일합니다 (line-length 100, double quotes). CI에서도 동일하게 검증합니다.

  ```powershell
  cd apps/backend
  uv run ruff format .
  uv run ruff check . --fix
  ```

- **TypeScript**: 컴포넌트는 PascalCase, 그 외 camelCase. ESLint로 검증합니다.
- **시크릿**: `.env`에만 두고 Git에서 제외합니다. `.env.example`에는 변수 이름만 적습니다.
- **DB 스키마 변경**: 반드시 Alembic 마이그레이션으로 수행합니다.

### 커밋 컨벤션

`타입: 한국어 설명` 형식을 사용합니다.

| 타입 | 용도 | 예시 |
|------|------|------|
| `add` | 새 기능/파일 | `add: 시뮬레이션 기능 추가` |
| `edit` | 수정/리팩토링 | `edit: 캠페인 승인 흐름 정리` |
| `fix` | 버그 수정 | `fix: 예산 계산 반올림 오류 수정` |
| `delete` | 삭제 | `delete: 미사용 라우터 제거` |

- 한 논리 단위 = 한 커밋. 무관한 변경을 한 커밋에 섞지 않습니다.
- **커밋 전 필수**: Ruff 통과 + 아키텍처 테스트(`tests/architecture/`) 통과.

## 스켈레톤(깡통 파일) 규칙

스켈레톤 단계의 모든 파일은 책임을 명시해야 합니다. 완전히 빈 파일은 금지입니다.

- **Python**: 모듈 docstring으로 책임 1~2줄 + 빈 시그니처에 `raise NotImplementedError` 또는 `...`
- **TypeScript/TSX**: 상단 주석으로 책임 1~2줄 + 최소 export (컴포넌트는 placeholder div 반환)

## 테스트

```
tests/
├─ architecture/   # 모듈 경계, public API 전용 참조, SDK import 위치 검증
├─ unit/           # creative / simulation / campaign 단위 테스트
├─ integration/
└─ e2e/
```

실행 방법은 다음과 같습니다.

```powershell
# 백엔드 전체
cd apps/backend
uv run pytest

# 아키텍처 테스트만 (커밋 전 필수)
uv run pytest tests/architecture -v

# 프론트엔드
cd apps/web
pnpm test        # unit
pnpm test:e2e    # e2e
```

## API 계약 워크플로

1. `contracts/openapi.yaml`을 수정합니다.
2. `scripts/generate_api_client.ps1`로 프론트 타입을 재생성합니다.
3. 생성된 `shared/api/generated/`는 절대 손으로 수정하지 않습니다.
